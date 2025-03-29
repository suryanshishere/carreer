import { fetchPostDetail } from "@controllers/posts/utils";
import { getDisplayKey } from "@controllers/utils";
import { generatePostCodeVersion } from "@controllers/utils/contribute-utils";
import POST_DB, { NON_REQUIRED_FIELD } from "@models/posts/db";
import { IPost } from "@models/posts/Post";
import Contribution, { IContribution } from "@models/users/Contribution";
import HttpError from "@utils/http-errors";
import { NextFunction, Request } from "express";
import _ from "lodash";
import mongoose from "mongoose";

export const flattenContributionData = (
  data: any,
  prefix: string = ""
): any => {
  let result: any = {};

  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof data[key] === "object" && data[key] !== null) {
        Object.assign(result, flattenContributionData(data[key], newKey));
      } else {
        result[newKey] = data[key];
      }
    }
  }
  return result;
};

export const updatePost = async (
  req: Request,
  next: NextFunction
): Promise<IPost | void> => {
  const { post_code, version, data, contributor_id, section } = req.body;

  // For fetch post detail to work
  req.params.postIdOrCode = post_code;
  req.params.version = version;
  req.params.section = section;

  const post = await fetchPostDetail(req, next);
  if (!post) return;

  // Use for...of loop to be able to exit early on error
  for (const key of Object.keys(data)) {
    const value = data[key];
    // Validation that triggers deletion
    const isDeleted =
      (typeof value === "string" && value.toLowerCase() === "deleted") ||
      (typeof value === "number" && isNaN(value));

    // If field should be deleted but is not allowed to be, trigger an error and exit immediately.
    if (isDeleted && !NON_REQUIRED_FIELD[key]) {
      return next(
        new HttpError(`Validation failed for field: ${getDisplayKey(key)}`, 400)
      );
    }

    if (_.get(post, key) !== undefined) {
      // For existing keys in the post object
      if (isDeleted) {
        // Remove the key entirely
        _.set(post,key, undefined);
      } else {
        _.set(post, key, value);
      }
    } else {
      // Handle dynamic fields
      const dynamicKey = key.replace(/\./g, "_1_");
      const dynamicObj = post.dynamic_field
        ? Object.fromEntries(post.dynamic_field)
        : { ...(post.dynamic_field ?? {}) };

      if (typeof value === "string" && value.toLowerCase() === "deleted") {
        delete dynamicObj[dynamicKey];
      } else {
        dynamicObj[dynamicKey] = value;
      }

      if (Object.keys(dynamicObj).length === 0) {
        post.dynamic_field = undefined;
      } else {
        post.dynamic_field = new Map(Object.entries(dynamicObj));
      }
      post.markModified("dynamic_field");
    }
  }

  // Update contributors list
  const contributorsField = `${section}_contributors`;
  if (!Array.isArray(post[contributorsField])) {
    post[contributorsField] = [];
  }
  if (!post[contributorsField].includes(contributor_id)) {
    post[contributorsField].push(contributor_id);
  }
  return post;
};

export const updateContributors = async (
  req: Request,
  session: mongoose.ClientSession,
  next: (error: HttpError) => void
): Promise<IContribution | void> => {
  try {
    const { contributor_id, post_code, version, section, data, status } =
      req.body;
    const postCodeVersion = generatePostCodeVersion(post_code, version);
    const approverId = req.userData?.userId || "";

    let contributor = await Contribution.findById(contributor_id)
      .select(`contribution.${postCodeVersion}.${section} approved disapproved`)
      .session(session);

    if (!contributor) {
      return next(new HttpError("Contributor not found!", 400));
    }

    // =======================
    // Update Contributor Contribution
    // =======================
    const contributionMap = contributor.contribution.get(postCodeVersion);
    if (!contributionMap) {
      return next(new HttpError("Post code data not found.", 404));
    }

    // Convert to a plain object (if necessary)
    const postObj = contributionMap.toObject
      ? contributionMap.toObject()
      : { ...contributionMap };

    if (!(section in postObj)) {
      return next(new HttpError("Contributed section data not found.", 404));
    }

    // Remove specified keys from the section
    Object.keys(data).forEach((key) => {
      delete postObj[section][key];
    });

    // If the section becomes empty, remove it
    if (Object.keys(postObj[section]).length === 0) {
      delete postObj[section];
    }

    // If postObj is empty, remove the entire postCodeVersion entry; otherwise update it
    if (Object.keys(postObj).length === 0) {
      contributor.contribution.delete(postCodeVersion);
      contributor.markModified("contribution");
    } else {
      contributor.contribution.set(postCodeVersion, postObj);
      contributor.markModified(`contribution.${postCodeVersion}`);
    }

    // =======================
    // Update Contributor Approval (on bases of status)
    // =======================

    let contributorApprovals =
      status === "approved" ? contributor.approved : contributor.disapproved;

    if (!Array.isArray(contributorApprovals)) {
      contributorApprovals = [];
    }

    // Find an existing approval by the same approver
    const existingApproval = contributorApprovals.find(
      (approval) => approval.approver.toString() === approverId
    );

    if (existingApproval) {
      // Get existing approval data for this postCodeVersion or default to an empty object
      const approvalData = existingApproval.data.get(postCodeVersion) || {};
      // Merge new data with any existing data for the section
      approvalData[section] = { ...approvalData[section], ...data };
      existingApproval.data.set(postCodeVersion, approvalData);
    } else {
      // Create a new approval entry for this approver
      const newApprovalData = new Map<string, Record<string, any>>();
      newApprovalData.set(postCodeVersion, { [section]: data });
      contributorApprovals.push({
        approver: approverId as string,
        data: newApprovalData,
      });
    }

    return contributor;
  } catch (error) {
    if (error instanceof Error) {
      return next(new HttpError(error.message, 500));
    }
    return next(
      new HttpError(
        "An unknown error occurred while updating contributor.",
        500
      )
    );
  }
};

// Helper function to save all populated post references efficiently
export const savePostReferences = async (post: any) => {
  const references = POST_DB.overall
    .map((field) => post[`${field}_ref`])
    .filter(Boolean);
  await Promise.all(references.map((ref) => ref.save()));
};
