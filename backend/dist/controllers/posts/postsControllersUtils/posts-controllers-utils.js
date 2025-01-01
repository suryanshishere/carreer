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
exports.fetchPostList = void 0;
exports.getSectionPostDetails = getSectionPostDetails;
const post_model_map_1 = require("@controllers/sharedControllers/post-model-map");
const posts_populate_1 = require("./postPopulate/posts-populate");
const sectionPostListSelect_1 = require("./postSelect/sectionPostListSelect");
const date_model_1 = __importDefault(require("src/models/post/componentModels/date-model"));
const post_sort_map_1 = __importDefault(require("./post-sort-map"));
const http_errors_1 = __importDefault(require("src/utils/http-errors"));
const sectionPostDetailSelect_1 = require("./postSelect/sectionPostDetailSelect");
const getSortedDateIds = (section) => __awaiter(void 0, void 0, void 0, function* () {
    const currentDate = new Date();
    // Calculate the start and end of the range for the current year
    const startOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const endOfNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0);
    // Construct the query conditions dynamically
    const queryConditions = [];
    // Add conditions for `current_year` for the last 5 years
    for (let i = 0; i <= 5; i++) {
        const startOfPreviousMonthYear = new Date(startOfPreviousMonth.getFullYear() - i, startOfPreviousMonth.getMonth(), startOfPreviousMonth.getDate());
        const endOfNextMonthYear = new Date(endOfNextMonth.getFullYear() - i, endOfNextMonth.getMonth(), endOfNextMonth.getDate());
        // Check `current_year` for this year
        queryConditions.push({
            [`${post_sort_map_1.default[section]}.current_year`]: {
                $gte: startOfPreviousMonthYear,
                $lte: endOfNextMonthYear,
            },
        });
    }
    // Add fallback conditions for `previous_year` for the last 5 years
    for (let i = 0; i <= 5; i++) {
        const startOfPreviousMonthYear = new Date(startOfPreviousMonth.getFullYear() - i, startOfPreviousMonth.getMonth(), startOfPreviousMonth.getDate());
        const endOfNextMonthYear = new Date(endOfNextMonth.getFullYear() - i, endOfNextMonth.getMonth(), endOfNextMonth.getDate());
        // Check `previous_year` for this year
        queryConditions.push({
            [`${post_sort_map_1.default[section]}.previous_year`]: {
                $gte: startOfPreviousMonthYear,
                $lte: endOfNextMonthYear,
            },
        });
    }
    const query = { $or: queryConditions };
    const sortedDateIds = yield date_model_1.default.find(query)
        .select("_id") // Only fetch the IDs
        .lean();
    return sortedDateIds.map((date) => date._id); // Return an array of IDs
});
const fetchPostList = (section_1, ...args_1) => __awaiter(void 0, [section_1, ...args_1], void 0, function* (section, includePopulate = true, next) {
    try {
        const model = post_model_map_1.SECTION_POST_MODAL_MAP[section];
        if (!model) {
            return null;
        }
        const sectionSelect = sectionPostListSelect_1.sectionPostListSelect[section] || "";
        let selectFields = sectionPostListSelect_1.COMMON_SELECT_FIELDS.split(" ");
        if (sectionSelect.startsWith("-")) {
            selectFields = sectionSelect.split(" ");
        }
        else if (sectionSelect) {
            selectFields.push(...sectionSelect.split(" "));
        }
        const sortedPostIds = yield getSortedDateIds(section);
        // console.log(sortedPostIds);
        // Step 1: Fetch posts using sorted IDs
        let query = model
            .find({
            _id: { $in: sortedPostIds }, // Match posts with sorted IDs
            approved: true,
        })
            .select(selectFields);
        if (includePopulate && posts_populate_1.sectionListPopulate[section]) {
            query = query.populate(posts_populate_1.sectionListPopulate[section]);
        }
        else {
            //for home list with less populate
            query = query.populate([
                {
                    path: "important_dates",
                    select: "",
                },
                {
                    path: "post",
                    select: "post_code",
                },
            ]);
        }
        const posts = yield query.exec();
        // Step 2: Reorder posts based on sortedPostIds
        const orderedPosts = sortedPostIds.map((id) => posts.find((post) => post._id.toString() === id.toString()));
        return orderedPosts.filter(Boolean).map((post) => post._doc); // Ensure no undefined values
    }
    catch (error) {
        console.error("Error fetching post list:", error);
        return next(new http_errors_1.default("Failed to fetch post list. Please try again later.", 500));
    }
});
exports.fetchPostList = fetchPostList;
function getSectionPostDetails(section, postId) {
    return __awaiter(this, void 0, void 0, function* () {
        const model = post_model_map_1.SECTION_POST_MODAL_MAP[section];
        const sectionSelect = sectionPostDetailSelect_1.sectionPostDetailSelect[section] || "";
        let selectFields = sectionPostDetailSelect_1.COMMON_POST_DETAIL_SELECT_FIELDS.split(" ");
        if (sectionSelect.startsWith("-")) {
            selectFields = sectionSelect.split(" ");
        }
        else if (sectionSelect) {
            selectFields.push(...sectionSelect.split(" "));
        }
        const result = yield model
            .findOne({ _id: postId, approved: true })
            .select(selectFields)
            .populate(posts_populate_1.sectionDetailPopulateModels[section]);
        return result;
    });
}
