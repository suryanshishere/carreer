import Contribution from "@models/users/Contribution";
import { NextFunction, Request, Response } from "express";
import HttpError from "@utils/http-errors";
import {
  flattenContributionData,
  savePostReferences,
  updateContributors,
  updatePost,
} from "./approver-controllers-utils";
import mongoose from "mongoose";
import handleValidationErrors from "@controllers/utils/validation-error";
import { ISectionKey } from "@models/posts/db";
import { fetchPostList, getTagForPost } from "@controllers/posts/utils";
import _ from "lodash";
import { generatePostCodeVersion } from "@controllers/utils/contribute-utils";
import PostModel from "@models/posts/Post";
import User from "@models/users/User";

export const getContriPostCodes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { section } = req.params;

  try {
    handleValidationErrors(req, next);
    const result = await Contribution.aggregate([
      {
        // Step 1: Convert the 'contribution' field to an array of key-value pairs
        $project: {
          contribution: { $objectToArray: "$contribution" },
        },
      },
      {
        // Step 2: Unwind the contribution array
        $unwind: "$contribution",
      },
      {
        // Step 3: Filter documents where the specified section exists in the contribution data
        $match: {
          [`contribution.v.${section}`]: { $exists: true },
        },
      },
      {
        // Step 4: Group by the contribution key ('k'), counting occurrences
        $group: {
          _id: "$contribution.k", // Use the key (post_code) as the group ID
          contribution_submission: { $sum: 1 }, // Count occurrences
        },
      },
      {
        // Step 5: Rename _id to post_code in the output
        $project: {
          post_code: "$_id", // Rename _id to post_code
          contribution_submission: 1, // Retain the count field
        },
      },
    ]);

    // If no contributions are found, return a 404 response
    if (!result.length) {
      return res
        .status(404)
        .json({ message: "No contributions found for the given section." });
    }

    // Send the reshaped result to the client
    return res.status(200).json({
      data: result,
      message: "Contribution post codes fetched successfully!",
    });
  } catch (error) {
    return next(new HttpError("Error fetching contribution post codes", 500));
  }
};

export const getContriPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { section, postCode, version } = req.params as {
    section: ISectionKey;
    postCode: string;
    version?: string;
  };
  const postCodeVersion = generatePostCodeVersion(postCode, version);

  try {
    handleValidationErrors(req, next);

    // Retrieve the post document
    // const post = await fetchPostDetail(section, postCode, version);
    // if (!post) {
    //   return next(new HttpError("Post not found!", 404));
    // }

    // Find the contribution posts for the specified section and postCode
    const contributionPosts = await Contribution.find({
      [`contribution.${postCodeVersion}.${section}`]: { $exists: true },
    })
      .select(`contribution.${postCodeVersion}.${section}`)
      .limit(10) //less item since it would have some correct data
      .exec();

    // Flatten each contribution entry and add it to the response
    const flattenedPosts = contributionPosts.map((contri) => {
      const contributionData =
        contri.contribution.get(postCodeVersion)?.[section]; /// Safe access

      // Check if contributionData exists before flattening
      if (contributionData) {
        const flattenedContribution = flattenContributionData(contributionData);

        return {
          _id: contri._id,
          ...flattenedContribution,
        };
      }

      // Return the contribution without flattening if contributionData doesn't exist
      return {
        _id: contri._id,
        message: "No contribution data found for the specified section.",
      };
    });

    // Return the response with the cleaned-up flattened data
    return res.status(200).json({
      data: flattenedPosts,
      // POST_DB: post,
      message: "Contributed post fetched successfully!",
    });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Fetching contribution post failed, please try again!", 500)
    );
  }
};

export const applyContri = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    handleValidationErrors(req, next);

    let post = await updatePost(req, next);
    if (!post) return;

    //only contributors is updated
    if (req.body.contributor_req) {
      let contributor = await updateContributors(req, session, next);
      if (!contributor) return;
      await contributor.save({ session });
    }

    //saving of all modification on the db
    await savePostReferences(post);
    await post.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json({ message: "Post updated and configured successfully!" });
  } catch (error) {
    console.error(error);

    // Rollback transaction
    await session.abortTransaction();
    session.endSession();

    return next(new HttpError("Something went wrong. Please try again.", 500));
  }
};

export const nonApprovedPosts = async (
  req: Request<{ section: ISectionKey; active?: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { section, active } = req.params;
    handleValidationErrors(req, next);

    const userId = req.userData?.userId;
    const user = await User.findById(userId);
    let savedIds: string[] = [];
    if (user?.saved_posts?.[section]) {
      savedIds = user.saved_posts[section].map(String);
    }

    // Fetch non-approved posts
    const response = await fetchPostList(
      section,
      true,
      next,
      false,
      active ? true : false
    );

    if (!response || response.length === 0) {
      return next(new HttpError("No non-approved posts found.", 404));
    }

    // Adding saved status and tags
    const postsWithSavedStatus = response?.map(({ _id, date_ref, ...rest }) => {
      return {
        _id,
        ...rest,
        is_saved: savedIds.includes(String(_id)),
        tag: getTagForPost(date_ref, section),
        date_ref,
      };
    });

    return res.status(200).json({
      message: "Non-approved posts fetched successfully!",
      data: postsWithSavedStatus,
    });
  } catch (error) {
    console.error("Error fetching non-approved posts:", error);
    return next(
      new HttpError(
        "Failed to fetch non-approved posts. Please try again later.",
        500
      )
    );
  }
};

export const postApproval = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId, section, approved } = req.body;

    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      { $set: { [`${section}_approved`]: approved } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found!" });
    }

    return res.status(200).json({ message: "Approval status updated." });
  } catch (error) {
    next(error);
  }
};
