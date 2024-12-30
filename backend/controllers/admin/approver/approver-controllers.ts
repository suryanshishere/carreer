import ContributionModel from "@models/user/contribution-model";
import { snakeCase } from "lodash";
import {
  MODAL_MAP,
  SECTION_POST_MODAL_MAP,
} from "@controllers/sharedControllers/post-model-map";
import { postIdGeneration } from "../publisher/publisher-controllers-utils";
import {
  COMMON_POST_DETAIL_SELECT_FIELDS,
  sectionPostDetailSelect,
} from "@controllers/posts/postsControllersUtils/postSelect/sectionPostDetailSelect";
import { sectionDetailPopulateModels } from "@controllers/posts/postsControllersUtils/postPopulate/posts-populate";
import { NextFunction, Request, Response } from "express";
import HttpError from "@utils/http-errors";
import { JWTRequest } from "@middleware/check-auth";
import {
  updateApproverData,
  updateContributorApproval,
  updateContributorContribution,
  updatePostData,
} from "./approver-controllers-utils";

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

export const flattenContributionData = (data: any, prefix: string = ''): any => {
  let result: any = {};

  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof data[key] === 'object' && data[key] !== null) {
        // If the value is an object, recursively flatten it
        Object.assign(result, flattenContributionData(data[key], newKey));
      } else {
        result[newKey] = data[key];
      }
    }
  }
  return result;
};

export const getContriPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { section, postCode } = req.params;
    const sec = snakeCase(section); // Convert section to snake_case

    // Dynamically retrieve the modal based on section name
    const modal = MODAL_MAP[sec];

    // Generate the postId from the postCode
    const postId = await postIdGeneration(postCode);

    // Retrieve the post document
    const post = await modal.findById(postId);

    // Find the contribution posts for the specified section and postCode
    const contributionPosts = await ContributionModel.find({
      [`contribution.${postCode}.${sec}`]: { $exists: true },
    })
      .select(`contribution.${postCode}.${sec}`)
      .limit(5)
      .exec();

    // Flatten each contribution entry and add it to the response
    const flattenedPosts = contributionPosts.map((contri) => {
      const contributionData = contri.contribution.get(postCode)?.[sec]; /// Safe access

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
      post_data: post,
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
  try {
    const { post_code, data, section, contributor_id } = req.body;
    const snakeCaseSection = snakeCase(section);
    const approverId = (req as JWTRequest).userData.userId;

    // Generate post ID from post_code
    const postId = await postIdGeneration(post_code);

    // Validate section model
    const model = SECTION_POST_MODAL_MAP[snakeCaseSection];
    if (!model) {
      return next(new HttpError("Invalid section specified.", 400));
    }

    // Prepare fields to select for the section
    const sectionSelect = sectionPostDetailSelect[snakeCaseSection] || "";
    let selectFields: string[] = COMMON_POST_DETAIL_SELECT_FIELDS.split(" ");

    if (sectionSelect.startsWith("-")) {
      selectFields = sectionSelect.split(" ");
    } else if (sectionSelect) {
      selectFields.push(...sectionSelect.split(" "));
    }

    // Find the post with the provided postId
    const post = await model
      .findOne({ _id: postId, approved: true })
      .select(selectFields)
      .populate(sectionDetailPopulateModels[snakeCaseSection]);

    if (!post) {
      return next(new HttpError("Post not found or not approved.", 404));
    }

    // Update post data
    updatePostData(post, data);
    const contributor = await ContributionModel.findById(contributor_id).select(
      `contribution.${post_code}.${section} approved`
    );
  
    if (!contributor) throw new HttpError("Contributor not found!", 400);

    // Contributor updates
    await updateContributorContribution(
      contributor,
      post_code,
      snakeCaseSection,
      data
    );

    // // Add or update the approved data
    // // const key = `${post_code}.${section}`;

    // // Use the utility function to update the data
    // await updateApproverData(contributor, approverId, post_code,section, data);
   
    await updateContributorApproval(
      contributor,
      approverId,
      post_code,
      section,
      data
    );

    // Save post and contributor data
    await contributor.save();
    await post.save();

    return res
      .status(200)
      .json({ message: "Post updated and configured successfully!" });
  } catch (error) {
    console.error("Error in applyContri:", error);
    return next(new HttpError("Something went wrong. Please try again.", 500));
  }
};
