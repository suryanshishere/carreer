import { Response, NextFunction } from "express";
import HttpError from "@utils/http-errors";
import { Request } from "express-jwt";
import { snakeCase } from "lodash";
import { getUserIdFromRequest, JWTRequest } from "@middleware/check-auth";
import CommonModel from "@models/post_models/componentModels/common-model";
import FeeModel from "@models/post_models/componentModels/fee-model";
import DateModel from "@models/post_models/componentModels/date-model";
import LinkModel from "@models/post_models/componentModels/link-model";
import PostModel from "@models/post_models/post-model";
import {
  fetchPostList,
  getSectionPostDetails,
} from "./postsControllersUtils/posts-controllers-utils";
import { SECTION_POST_MODAL_MAP } from "@controllers/sharedControllers/post-model-map";
import handleValidationErrors from "@controllers/sharedControllers/validation-error";
import User from "@models/user/user_model";
import { postIdGeneration } from "@controllers/admin/publisher/publisher-controllers-utils";
import mongoose from "mongoose";

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
  handleValidationErrors(req, next);
  const userId = getUserIdFromRequest(req as JWTRequest);
  try {
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
  handleValidationErrors(req, next);
  try {
    const { section } = req.params;
    const userId = getUserIdFromRequest(req as JWTRequest);
    const user = await User.findById(userId);
    let savedIds: string[] = [];
    if (user) {
      if (user?.saved_posts?.[section]) {
        savedIds = user.saved_posts[section].map(String);
      }
    }

    //if not max mode then not include populate of whole data
    const includePopulate = user?.mode?.max || false;
    const response = await fetchPostList(section, includePopulate, next);
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
  handleValidationErrors(req, next);
  let { section, postIdOrCode } = req.params;

  try {
    let postId: string | null = null;

    if (mongoose.Types.ObjectId.isValid(postIdOrCode)) {
      postId = postIdOrCode;
    } else {
      postId = await postIdGeneration(postIdOrCode);
    }

    if (!postId) {
      return next(
        new HttpError(
          "Unable to resolve a valid post ID from the provided data.",
          400
        )
      );
    }

    const response = await getSectionPostDetails(section, postId);

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
      data: response,
      is_saved: isSaved,
    };

    return res.status(200).json(responseWithSavedStatus);
  } catch (err) {
    console.error(err);
    return next(
      new HttpError("An error occurred while fetching the post.", 500)
    );
  }
};
