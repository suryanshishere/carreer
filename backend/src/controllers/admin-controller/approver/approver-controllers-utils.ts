import POST_DB from "@models/post-model/db";
import { IContribution } from "@models/user-model/Contribution";
import HttpError from "@utils/http-errors";
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

export const updateContributorContribution = async (
  contributor: IContribution,
  post_code: string,
  section: string,
  data: Record<string, any>,
  session: mongoose.ClientSession
) => {
  let contributionMap = contributor.contribution.get(post_code);
  if (!contributionMap) throw new HttpError("Post code data not found.", 404);

  const postObj = contributionMap.toObject ? contributionMap.toObject() : { ...contributionMap };

  if (!(section in postObj)) {
    throw new HttpError("Contributed section data not found.", 404);
  }

  // Remove the specified keys from the section
  Object.keys(data).forEach((key) => delete postObj[section][key]);

  // If section is now empty, remove it
  if (Object.keys(postObj[section]).length === 0) {
    delete postObj[section];
  }

  // If postObj is empty after removing the section, delete post_code entry completely
  if (Object.keys(postObj).length === 0) {
    contributor.contribution.delete(post_code);
    contributor.markModified("contribution");
  } else {
    contributor.contribution.set(post_code, postObj);
    contributor.markModified(`contribution.${post_code}`);
  }

  await contributor.save({ session });
  return contributor;
};

export const updateContributorApproval = async (
  contributor: IContribution,
  approverId: string,
  post_code: string,
  section: string,
  data: Record<string, any>,
  session: mongoose.ClientSession
) => {
  if (!Array.isArray(contributor.approved)) contributor.approved = [];

  const existingApproval = contributor.approved.find(
    (approval) => approval.approver.toString() === approverId
  );

  if (existingApproval) {
    let approvalData = existingApproval.data.get(post_code) || {};
    approvalData[section] = { ...approvalData[section], ...data };
    existingApproval.data.set(post_code, approvalData);
  } else {
    const newApprovalData = new Map<string, Record<string, any>>();
    newApprovalData.set(post_code, { [section]: data });
    contributor.approved.push({ approver: approverId, data: newApprovalData });
  }

  await contributor.save({ session });
};

// Helper function to save all populated post references efficiently
export const savePostReferences = async (post: any) => {
  const references = POST_DB.overall.map((field) => post[`${field}_ref`]).filter(Boolean);
  await Promise.all(references.map((ref) => ref.save()));
};
