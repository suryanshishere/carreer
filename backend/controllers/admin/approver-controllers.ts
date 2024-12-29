import ContributionModel from "@models/user/contribution-model";
import { set, snakeCase } from "lodash";
import {
  MODAL_MAP,
  SECTION_POST_MODAL_MAP,
} from "@controllers/sharedControllers/post-model-map";
import { postIdGeneration } from "./publisher/publisher-controllers-utils";
import { postDetail } from "@controllers/posts/posts-controllers";
import {
  COMMON_POST_DETAIL_SELECT_FIELDS,
  sectionPostDetailSelect,
} from "@controllers/posts/postsControllersUtils/postSelect/sectionPostDetailSelect";
import { sectionDetailPopulateModels } from "@controllers/posts/postsControllersUtils/postPopulate/posts-populate";
import mongoose, { Schema } from "mongoose";
import { SECTION_POST_SCHEMA_MAP } from "@controllers/sharedControllers/post-schema-map";
import { NextFunction, Request, Response } from "express";
import HttpError from "@utils/http-errors";
import { JWTRequest } from "@middleware/check-auth";

export const getContriPostCodes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { section } = req.params;
  const sec = snakeCase(section);

  try {
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
          [`contribution.v.${sec}`]: { $exists: true },
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
  try {
    const { section, postCode } = req.params;
    const sec = snakeCase(section);

    const modal = MODAL_MAP[sec];
    const postId = await postIdGeneration(postCode);

    const post = await modal.findById(postId);

    const contributionPosts = await ContributionModel.find({
      [`contribution.${postCode}.${sec}`]: { $exists: true },
    })
      .select(`contribution.${postCode}.${sec}`)
      .limit(5)
      .exec();

    const flattenedData = contributionPosts.map((doc: any) => {
      const postDetails =
        (doc.contribution as Map<string, { [key: string]: any }>).get(
          postCode
        )?.[sec] || {};

      return {
        _id: doc._id,
        ...postDetails,
      };
    });

    return res.status(200).json({
      data: flattenedData,
      post_data: post,
      message: "Contributed post fetched successfully!",
    });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Fetching contibution post failed, please try again!", 500)
    );
  }
};

export const applyContri = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { post_code, data, section, contributor_id } = req.body;
    section = snakeCase(section);

    const approverId = (req as JWTRequest).userData.userId;
    const postId = await postIdGeneration(post_code);

    const model = SECTION_POST_MODAL_MAP[section];
    if (!model) {
      return next(new HttpError("Invalid section specified.", 400));
    }

    const sectionSelect = sectionPostDetailSelect[section] || "";
    let selectFields: string[] = COMMON_POST_DETAIL_SELECT_FIELDS.split(" ");

    if (sectionSelect.startsWith("-")) {
      selectFields = sectionSelect.split(" ");
    } else if (sectionSelect) {
      selectFields.push(...sectionSelect.split(" "));
    }

    const post = await model
      .findOne({ _id: postId, approved: true })
      .select(selectFields)
      .populate(sectionDetailPopulateModels[section]);

    // Updating the post
    Object.keys(data).forEach((key) => {
      set(post, key, data[key]);
    });

    if (post.common) {
      await post.common.save();
    }

    if (post.important_dates) {
      await post.important_dates.save();
    }

    if (post.important_links) {
      await post.important_links.save();
    }

    if (post.application_fee) {
      await post.application_fee.save();
    }

    // Contributor updates
    const contributor = await ContributionModel.findById(contributor_id).select(
      `contribution.${post_code}.${section}`
    );
    if (!contributor) return next(new HttpError("Contributor not found!", 400));

    const contributionMap = contributor.contribution.get(post_code);
    if (!contributionMap) {
      return next(new HttpError("Post code data not found.", 404));
    }

    const contributedData = contributionMap[section];
    if (!contributedData) {
      return next(new HttpError("Contributed section data not found.", 404));
    }

    // Remove the provided key-value pairs from the contributed data
    Object.keys(data).forEach((key) => {
      if (key in contributedData) {
        delete contributedData[key]; // Remove the key from the contributed data
      }
    });

    // If the section is empty after deletion, remove the section
    if (Object.keys(contributedData).length === 0) {
      delete contributionMap[section];
    }


      //TODO
    // If the post code is empty after the section removal, delete the post code from the map
    if (Object.keys(contributionMap).length === 0) {
        contributionMap.delete(post_code);

         console.log(contributionMap)
    } else {
      // Update the contribution map for the post code
      contributionMap[section] = contributedData;
      contributor.contribution.set(post_code, contributionMap);
    }

    // Mark the 'contribution' map as modified so Mongoose knows to save it
    contributor.markModified("contribution");

    // Save the updated contribution document
    await contributor.save();

    await post.save();

    return res.status(200).json({ key: "good" });
  } catch (error) {
    console.error("Error in applyContri:", error);
    return next(new HttpError("Something went wrong. Please try again.", 500));
  }
};
