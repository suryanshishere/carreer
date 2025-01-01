"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateContributorApproval = exports.updateContributorContribution = exports.updatePostData = exports.flattenContributionData = void 0;
const http_errors_1 = __importDefault(require("src/utils/http-errors"));
const lodash_1 = require("lodash");
const mongodb_1 = require("mongodb");
const flattenContributionData = (data, prefix = "") => {
    let result = {};
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            const newKey = prefix ? `${prefix}.${key}` : key;
            if (typeof data[key] === "object" && data[key] !== null) {
                // If the value is an object, recursively flatten it
                Object.assign(result, (0, exports.flattenContributionData)(data[key], newKey));
            }
            else {
                result[newKey] = data[key];
            }
        }
    }
    return result;
};
exports.flattenContributionData = flattenContributionData;
const updatePostData = (post, data, contributor_id) => __awaiter(void 0, void 0, void 0, function* () {
    Object.keys(data).forEach((key) => {
        (0, lodash_1.set)(post, key, data[key]); // Use lodash's set or other appropriate method
    });
    if (!post.contributors) {
        // Initialize the contributors array if it doesn't exist
        post.contributors = [];
    }
    // Check if the contributor_id exists, and add it only if not present
    if (!post.contributors.some((id) => id.toString() === contributor_id)) {
        post.contributors.push(contributor_id);
    }
    if (post.common)
        yield post.common.save();
    if (post.important_dates)
        yield post.important_dates.save();
    if (post.important_links)
        yield post.important_links.save();
    if (post.application_fee)
        yield post.application_fee.save();
});
exports.updatePostData = updatePostData;
const updateContributorContribution = (contributor, post_code, section, data, session // Pass session here
) => __awaiter(void 0, void 0, void 0, function* () {
    let contributionMap = contributor.contribution.get(post_code);
    if (!contributionMap)
        throw new http_errors_1.default("Post code data not found.", 404);
    const contributedData = contributionMap[section];
    if (!contributedData)
        throw new http_errors_1.default("Contributed section data not found.", 404);
    // Replace old data with new data
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
    }
    else {
        contributionMap[section] = contributedData;
        contributor.contribution.set(post_code, contributionMap);
    }
    contributor.markModified("contribution");
    yield contributor.save({ session }); // Ensure the session is used here
    return contributor;
});
exports.updateContributorContribution = updateContributorContribution;
const updateContributorApproval = (contributor, approverId, post_code, section, data, session // Accept session here
) => __awaiter(void 0, void 0, void 0, function* () {
    if (!Array.isArray(contributor.approved)) {
        contributor.approved = [];
    }
    const existingApproval = contributor.approved.find((approval) => approval.approver.toString() === new mongodb_1.ObjectId(approverId).toString());
    if (existingApproval) {
        let cool = existingApproval.data.get(post_code);
        if (!cool) {
            cool = {};
        }
        if (!cool[section]) {
            cool[section] = {};
        }
        cool[section] = Object.assign(Object.assign({}, cool[section]), data);
        existingApproval.data.set(post_code, cool);
    }
    else {
        const newApprovalData = new Map();
        newApprovalData.set(post_code, {
            [section]: data,
        });
        contributor.approved.push({
            approver: approverId,
            data: newApprovalData,
        });
    }
    yield contributor.save({ session }); // Save with session
});
exports.updateContributorApproval = updateContributorApproval;
