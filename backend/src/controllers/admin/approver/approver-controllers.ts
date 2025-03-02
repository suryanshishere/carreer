import ContributionModel from "@models/user/contribution-model"; import { NextFunction, Request, Response } from "express";
import HttpError from "@utils/http-errors";
import { JWTRequest } from "@middleware/check-auth";
import {
  flattenContributionData,
  updateContributorApproval,
  updateContributorContribution,
  updatePostData,
} from "./approver-controllers-utils";
import mongoose from "mongoose";
import  handleValidationErrors  from "@controllers/sharedControllers/validation-error";
import { getSectionPostDetails } from "@controllers/posts/postsControllersUtils/posts-controllers-utils";
import { ISection } from "@models/post_models/post-interface";

export const getContriPostCodes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { section } = req.params;

  try {
    handleValidationErrors(req, next);
    const result = await ContributionModel.aggregate([
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
  const { section, postCode } = req.params;
  try {
    handleValidationErrors(req, next);
    const postId = postCode;
    // const postId = await postIdGeneration(postCode);

    // Retrieve the post document
    const post = await getSectionPostDetails(section, postId);
    if (!post) {
      return next(new HttpError("Post not found!", 404));
    }

    // Find the contribution posts for the specified section and postCode
    const contributionPosts = await ContributionModel.find({
      [`contribution.${postCode}.${section}`]: { $exists: true },
    })
      .select(`contribution.${postCode}.${section}`)
      .limit(5)
      .exec();

    // Flatten each contribution entry and add it to the response
    const flattenedPosts = contributionPosts.map((contri) => {
      const contributionData = contri.contribution.get(postCode)?.[section]; /// Safe access

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
        message: "No contribution data found for the specified section",
      };
    });

    // Return the response with the cleaned-up flattened data
    return res.status(200).json({
      data: flattenedPosts,
      POST_DB: post,
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
  const { post_code, data, section, contributor_id } = req.body;
  const approverId = (req as JWTRequest).userData.userId;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    handleValidationErrors(req, next);
    const postId = post_code;
    // const postId = await postIdGeneration(post_code);

    let post = await getSectionPostDetails<ISection | null>(section, postId);
    if (!post) {
      return next(new HttpError("Post not found or not approved.", 404));
    }

    // Update post data
    // This function is being updated, no session required here as it's just modifying the in-memory post object
    await updatePostData(post, data, contributor_id);

    const contributor = await ContributionModel.findById(contributor_id)
      .select(`contribution.${post_code}.${section} approved`)
      .session(session);

    if (!contributor) return next(new HttpError("Contributor not found!", 400));

    // Update contributor contribution
    await updateContributorContribution(
      contributor,
      post_code,
      section,
      data,
      session
    );

    // Update contributor approval
    await updateContributorApproval(
      contributor,
      approverId,
      post_code,
      section,
      data,
      session
    );

    // Save post and contributor data inside the transaction
    await contributor.save({ session });
    await post.save({ session });

    // Commit the transaction if all steps are successful
    await session.commitTransaction();

    // End the session
    session.endSession();

    return res
      .status(200)
      .json({ message: "Post updated and configured successfully!" });
  } catch (error) {

    console.log(error);

    // Rollback the transaction in case of any error
    await session.abortTransaction();
    session.endSession();

    return next(new HttpError("Something went wrong. Please try again.", 500));
  }
};
