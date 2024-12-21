import { Response, NextFunction } from "express";
import HttpError from "@utils/http-errors";
import { sectionDetailPopulateModels } from "./postsControllersUtils/postPopulate/posts-populate";
import { Request } from "express-jwt";
import { snakeCase } from "lodash";
import { getUserIdFromRequest, JWTRequest } from "@middleware/check-auth";
import CommonModel from "@models/post/componentModels/common-model";
import FeeModel from "@models/post/componentModels/fee-model";
import DateModel from "@models/post/componentModels/date-model";
import LinkModel from "@models/post/componentModels/link-model";
import PostModel from "@models/post/post-model";
import { fetchPostList } from "./postsControllersUtils/posts-controllers-utils";
import { SECTION_POST_MODAL_MAP } from "@controllers/controllersUtils/post-model-map";
import {
  COMMON_POST_DETAIL_SELECT_FIELDS,
  sectionPostDetailSelect,
} from "./postsControllersUtils/postSelect/sectionPostDetailSelect";
import validationError from "@controllers/controllersUtils/validation-error";
import { validationResult } from "express-validator";
import  User  from "@models/user/user-model";

// const HOME_LIMIT = Number(process.env.NUMBER_OF_POST_SEND_HOMELIST) || 12;
//todo
const CATEGORY_LIMIT =
  Number(process.env.NUMBER_OF_POST_SEND_CATEGORYLIST) || 25;

// Example utility function (unused)
export const helpless = () => {
  const cool = LinkModel.find({});
  const cool1 = DateModel.find({});
  const cool2 = FeeModel.find({});
  const cool3 = CommonModel.find({});
  const cool5 = PostModel.find({});
};

export const home = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserIdFromRequest(req as JWTRequest);
    const user = await User.findById(userId);
    const savedPost = user?.saved_posts || null;

    const dataPromises = Object.keys(SECTION_POST_MODAL_MAP).map(
      async (key: string) => {
        const snakeKey = snakeCase(key);
        const savedIds = savedPost?.[snakeKey]?.map(String) || [];
        const posts = await fetchPostList(snakeKey, false, next);

        //todo: improve error handling
        return {
          [snakeKey]: posts?.map(({ _id, ...rest }) => ({
            _id,
            is_saved: savedIds.includes(String(_id)),
            ...rest,
          })),
        };
      }
    );

    const dataArray = await Promise.all(dataPromises);
    const response = dataArray.reduce((acc, curr) => {
      return { ...acc, ...curr };
    }, {});

    return res.status(200).json({ data: response });
  } catch (err) {
    console.log(err);
    return next(new HttpError("An error occurred while fetching posts", 500));
  }
};

export const section = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { section } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError(validationError(errors), 400));
    }

    const userId = getUserIdFromRequest(req as JWTRequest);
    const user = await User.findById(userId);
    let savedIds: string[] = [];
    if (user) {
      if (user?.saved_posts?.[section]) {
        savedIds = user.saved_posts[section].map(String);
      }
    }

    const response = await fetchPostList(section, true, next);
    //todo: if null them better
    const postsWithSavedStatus = response?.map(({ _id, ...rest }) => ({
      _id,
      ...rest,
      is_saved: savedIds.includes(String(_id)),
    }));

    const responseData = {
      data: { [section]: postsWithSavedStatus },
    };

    return res.status(200).json(responseData);
  } catch (err) {
    return next(new HttpError("An error occurred while fetching posts!", 500));
  }
};

// Get the detailed information of a specific post
export const postDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { section, postId } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError(validationError(errors), 400));
    }

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

    const response = await model
      .findOne({ _id: postId, approved: true })
      .select(selectFields)
      .populate(sectionDetailPopulateModels[section]);

    if (!response) {
      return next(new HttpError("Post not found!", 404));
    }

    let isSaved = false;
    const userId = getUserIdFromRequest(req as JWTRequest);
    const user = await User.findById(userId);
    const { Types } = require("mongoose");

    if (user && user?.saved_posts) {
      const savedPosts = user.saved_posts[section] || [];
      const postIdObj = new Types.ObjectId(postId);
      isSaved = savedPosts.some((savedPost) => savedPost.equals(postIdObj));
    }

    const responseWithSavedStatus = {
      data: response.toObject(),
      is_saved: isSaved,
    };

    return res.status(200).json(responseWithSavedStatus);
  } catch (err) {
    // console.log(err);
    return next(
      new HttpError("An error occurred while fetching the post.", 500)
    );
  }
};
