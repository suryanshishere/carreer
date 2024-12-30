import ContributionModel, {
  IContribution,
} from "@models/user/contribution-model";
import HttpError from "@utils/http-errors";
import { set } from "lodash";
import { ObjectId } from "mongodb";

export const updatePostData = (post: any, data: Record<string, any>) => {
  Object.keys(data).forEach((key) => {
    set(post, key, data[key]);
  });

  if (post.common) post.common.save();
  if (post.important_dates) post.important_dates.save();
  if (post.important_links) post.important_links.save();
  if (post.application_fee) post.application_fee.save();
};

// Function to update contributor's contribution map
export const updateContributorContribution = async (
  contributor: IContribution,
  post_code: string,
  section: string,
  data: Record<string, any>
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
  await contributor.save();
  return contributor;
};

export const updateApproverData = async (
  contributor: IContribution,
  approverId: string,
  post_code: string,
  section: string,
  newData: Record<string, any>
) => {
  if (!Array.isArray(contributor.approved)) {
    contributor.approved = [];
  }

  // Update or add approval data for the specific post_code and section
  const existingApproval = contributor.approved.find((approval) => {
    return approval.approver.toString() === approverId;
  });

  if (existingApproval) {
    if (!existingApproval.data.has(post_code)) {
      existingApproval.data.set(post_code, {});
    }
    const sectionData = existingApproval.data.get(post_code) || {};
    sectionData[section] = {
      ...sectionData[section],
      ...newData,
    };
    existingApproval.data.set(post_code, sectionData);
  } else {
    contributor.approved.push({
      approver: approverId,
      data: new Map([[post_code, { [section]: newData }]]),
    });
  }

  // Dynamically update the contribution map for the given post_code and section
  const postContribution = contributor.contribution.get(post_code) || {};
  postContribution[section] = {
    ...postContribution[section],
    ...newData,
  };
  contributor.contribution.set(post_code, postContribution);
};

export const updateContributorApproval = async (
  contributor: IContribution,
  approverId: string,
  post_code: string,
  section: string,
  data: Record<string, any>
) => {

  console.log(contributor)

  if (!Array.isArray(contributor.approved)) {
    contributor.approved = [];
  }

  const existingApproval = contributor.approved.find(
    (approval) => approval.approver.toString() === new ObjectId(approverId).toString()
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
};
