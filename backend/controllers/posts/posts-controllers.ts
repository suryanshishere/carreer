import { Response, NextFunction } from "express";
import HttpError from "@utils/http-errors";
import { sectionDetailPopulateModels, MODEL_DATA } from "./postPopulate/posts-populate";
import { Request } from "express-jwt";
import { snakeCase } from "lodash";
import { JWTRequest } from "@middleware/check-auth";
import CommonModel from "@models/post/overallModels/common-model";
import FeeModel from "@models/post/overallModels/fee-model";
import DateModel from "@models/post/overallModels/date-model";
import LinkModel from "@models/post/overallModels/link-model";
import PostModel from "@models/post/post-model";
import { fetchPostList } from "./posts-controllers-utils";

// const HOME_LIMIT = Number(process.env.NUMBER_OF_POST_SEND_HOMELIST) || 12;
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
    const user = (req as JWTRequest).user;
    const savedPost = user?.saved_posts || null;

    const dataPromises = Object.keys(MODEL_DATA).map(async (key: string) => {
      const savedField = `${snakeCase(key)}_ref`;
      const savedIds = savedPost?.[savedField]?.map(String) || [];
      const posts = await fetchPostList(snakeCase(key));

      //todo: improve error handling
      return {
        [snakeCase(key)]: posts?.map(({ _id, ...rest }) => ({
          _id,
          is_saved: savedIds.includes(String(_id)),
          ...rest,
        })),
      };
    });

    const dataArray = await Promise.all(dataPromises);
    const response = dataArray.reduce((acc, curr) => {
      return { ...acc, ...curr };
    }, {});

    return res.status(200).json({ data: response });
  } catch (err) {
    return next(new HttpError("An error occurred while fetching posts", 500));
  }
};

export const section = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { section } = req.params;
  const sec = snakeCase(section);

  try {
    const user = (req as JWTRequest).user;
    let savedIds: string[] = [];
    if (user) {
      const savedField = `${sec}_ref`;

      if (user?.saved_posts?.[savedField]) {
        savedIds = user.saved_posts[savedField].map(String);
      }
    }

    const response = await fetchPostList(sec);
    //todo: if null them better
    const postsWithSavedStatus = response?.map(({ _id, ...rest }) => ({
      _id,
      ...rest,
      is_saved: savedIds.includes(String(_id)),
    }));

    const responseData = {
      data: { [sec]: postsWithSavedStatus },
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
  const { section, postId } = req.params;
  const sec = snakeCase(section);
  try {
    const model = MODEL_DATA[sec];
    if (!model) {
      return next(new HttpError("Invalid section specified.", 400));
    }

    const response = await model
      .findOne({ _id: postId, approved: true })
      .populate(sectionDetailPopulateModels[sec])
      .select("-approved");

    if (!response) {
      return next(new HttpError("Post not found!", 404));
    }

    let isSaved = false;
    const user = (req as JWTRequest).user;
    const { Types } = require("mongoose");

    if (user && user?.saved_posts) {
      const savedField = `${sec}_ref`;
      const savedPosts = user.saved_posts[savedField] || [];
      const postIdObj = new Types.ObjectId(postId);
      isSaved = savedPosts.some((savedPost) => savedPost.equals(postIdObj));
    }

    const responseWithSavedStatus = {
      data: response.toObject(),
      is_saved: isSaved,
    };

    return res.status(200).json(responseWithSavedStatus);
  } catch (err) {
    return next(
      new HttpError("An error occurred while fetching the post.", 500)
    );
  }
};
