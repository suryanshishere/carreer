import { Response, NextFunction } from "express";
import HttpError from "@utils/http-errors";
import { Request } from "express-jwt";
import { getUserIdFromRequest, JWTRequest } from "@middlewares/check-auth";
import CommonModel from "@models/posts/components/Common";
import FeeModel from "@models/posts/components/Fee";
import DateModel from "@models/posts/components/Date";
import LinkModel from "@models/posts/components/Link";
import PostModel from "@models/posts/Post";
import { fetchPostDetail, fetchPostList } from "./utils";
import { SECTION_POST_MODEL_MAP } from "@models/posts/db/post-map/post-model-map";
import handleValidationErrors from "@controllers/utils/validation-error";
import User from "@models/users/User";
import { ISectionKey } from "@models/posts/db";

// const HOME_LIMIT = Number(process.env.NUMBER_OF_POST_SEND_HOMELIST) || 12;
//todo
// const CATEGORY_LIMIT =
//   Number(process.env.NUMBER_OF_POST_SEND_CATEGORYLIST) || 25;

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

    const dataPromises = Object.keys(SECTION_POST_MODEL_MAP).map(
      async (key) => {
        const savedIds = savedPost?.[key]?.map(String) || [];
        const posts = await fetchPostList(key as ISectionKey, false, next);

        //todo: improve error handling
        return {
          [key]: posts?.map(({ _id, ...rest }) => ({
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
    const section = req.params.section as ISectionKey;
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
  const {
    section,
    postIdOrCode,
    version = "main",
  } = req.params as {
    section: ISectionKey;
    postIdOrCode: string;
    version?: string;
  };

  try {
    const response = await fetchPostDetail(section, postIdOrCode, version);

    if (!response) {
      return next(new HttpError("Post not found!", 404));
    }

    let isSaved = false;
    const userId = getUserIdFromRequest(req as JWTRequest);
    const user = await User.findById(userId);
    const { Types } = require("mongoose");

    if (user && user?.saved_posts) {
      const savedPosts = user.saved_posts[section] || [];
      const postIdObj = new Types.ObjectId(response._id);
      isSaved = savedPosts.some((savedPost) => savedPost.equals(postIdObj));
    }

    return res.status(200).json({
      data: response,
      is_saved: isSaved,
    });
  } catch (err) {
    console.error(err);
    return next(
      new HttpError("An error occurred while fetching the post.", 500)
    );
  }
};
