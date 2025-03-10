import { IContribution } from "@models/user-model/Contribution";
import HttpError from "@utils/http-errors";
import { set } from "lodash";
import { ObjectId } from "mongodb";
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

// export const updatePostData = async (
//   post: ISection,
//   data: Record<string, any>,
//   contributor_id: string
// ) => {
//   Object.keys(data).forEach((key) => {
//     set(post, key, data[key]);
//   });

  //TODO ACCORDING TO THE NEW POST MODAL THEMES

  // if (!post.contributors) {
  //   post.contributors = [];
  // }

  //  if (!post.contributors.some((id) => id.toString() === contributor_id)) {
  //   post.contributors.push(contributor_id);
  // }

  // if (post.common) await (post.common as ICommon).save();
  // if (post.important_dates) await (post.important_dates as IDates).save();
  // if (post.important_links) await (post.important_links as ILink).save();
  // if (post.application_fee) await (post.application_fee as IFee).save();
// };

export const updateContributorContribution = async (
  contributor: IContribution,
  post_code: string,
  section: string,
  data: Record<string, any>,
  session: mongoose.ClientSession
) => {
  let contributionMap = contributor.contribution.get(post_code);
  if (!contributionMap) throw new HttpError("Post code data not found.", 404);

  const contributedData = contributionMap[section];
  if (!contributedData)
    throw new HttpError("Contributed section data not found.", 404);

  Object.keys(data).forEach((key) => {
    if (key in contributedData) {
      delete contributedData[key];
    }
  });

  if (Object.keys(contributedData).length === 0) {
    delete contributionMap[section];
  }

  if (Object.keys(contributionMap).length === 0) {
    contributor.contribution.delete(post_code);
  } else {
    contributionMap[section] = contributedData;
    contributor.contribution.set(post_code, contributionMap);
  }

  contributor.markModified("contribution");
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
  if (!Array.isArray(contributor.approved)) {
    contributor.approved = [];
  }

  const existingApproval = contributor.approved.find(
    (approval) =>
      approval.approver.toString() === new ObjectId(approverId).toString()
  );

  if (existingApproval) {
    let cool = existingApproval.data.get(post_code);

    if (!cool) {
      cool = {};
    }

    if (!cool[section]) {
      cool[section] = {};
    }

    cool[section] = {
      ...cool[section],
      ...data,
    };

    existingApproval.data.set(post_code, cool);
  } else {
    const newApprovalData = new Map<string, Record<string, any>>();
    newApprovalData.set(post_code, {
      [section]: data,
    });

    contributor.approved.push({
      approver: approverId,
      data: newApprovalData,
    });
  }

  await contributor.save({ session });
};
