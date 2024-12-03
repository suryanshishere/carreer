import { Response, NextFunction } from "express";
import PostDate from "@models/post/overallModel/date-model";
import PostFee from "@models/post/overallModel/fee-model";
import PostLink from "@models/post/overallModel/link-model";
import PostCommon from "@models/post/overallModel/common-model";
import Post from "@models/post/post-model";
import HttpError from "@utils/http-errors";
import { fetchPosts, populateModels, MODEL_DATA } from "./posts-populate";
import { Request } from "express-jwt";
import User from "@models/user/user-model";
import { snakeCase } from "lodash";
import { getUserIdFromRequest, JWTRequest } from "@middleware/check-auth";

const HOME_LIMIT = Number(process.env.NUMBER_OF_POST_SEND_HOMELIST) || 12;
const CATEGORY_LIMIT =
  Number(process.env.NUMBER_OF_POST_SEND_CATEGORYLIST) || 25;

// Example utility function (unused)
export const helpless = () => {
  const cool = PostLink.find({});
  const cool1 = PostDate.find({});
  const cool2 = PostFee.find({});
  const cool3 = PostCommon.find({});
  const cool5 = Post.find({});
};

// Get the list of posts for the home page
export const home = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getUserIdFromRequest(req as JWTRequest);

    const user = userId
      ? await User.findById(userId).select("saved_posts").lean()
      : null;

    // Fetch and process posts for each category
    const dataPromises = Object.keys(MODEL_DATA).map(async (key) => {
      const model = MODEL_DATA[key];
      const posts = await fetchPosts(model, HOME_LIMIT);

      // Convert category to snake_case and append "_ref" to check saved_posts
      const savedField = `${snakeCase(key)}_ref`;
      const savedIds = user?.saved_posts?.[savedField]?.map(String) || [];
      
      return {
        [snakeCase(key)]: posts.map(({ name_of_the_post, post_code, _id }) => ({
          name_of_the_post,
          post_code,
          _id,
          is_saved: savedIds.includes(String(_id)),
        })),
      };
    });

    const dataArray = await Promise.all(dataPromises);

    // Combine results into a single object
    const response = dataArray.reduce((acc, curr) => {
      return { ...acc, ...curr };
    }, {});

    return res.status(200).json({ data: response });
  } catch (err) {
    console.error("Error fetching posts for home list:", err);
    return next(new HttpError("An error occurred while fetching posts", 500));
  }
};

export const section = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { section } = req.params;

  try {
    const userId = getUserIdFromRequest(req as JWTRequest);
    const model = MODEL_DATA[section];
    if (!model) {
      return next(new HttpError("Invalid category specified.", 400));
    }
    
    const response = await fetchPosts(model, CATEGORY_LIMIT);
   
    let savedIds: string[] = [];
    if (userId) {
      const user = await User.findById(userId).select("saved_posts").lean();
      const savedField = `${snakeCase(section)}_ref`; 

      if (user?.saved_posts?.[savedField]) {
        savedIds = user.saved_posts[savedField].map(String); 
      }
    }

    const postsWithSavedStatus = response.map(
      ({ name_of_the_post, post_code, _id }) => ({
        name_of_the_post,
        post_code,
        _id,
        is_saved: savedIds.includes(String(_id)), 
      })
    );

    const responseData = {
      data: { [snakeCase(section)]: postsWithSavedStatus },
    };
    return res.status(200).json(responseData);
  } catch (err) {
    return next(new HttpError("An error occurred while fetching posts!", 500));
  }
};

// Get the detailed information of a specific post
export const sectionDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { section, postId } = req.params;

  try {
    const model = MODEL_DATA[section];
    if (!model) {
      return next(new HttpError("Invalid section specified.", 400));
    }

    // Fetch post details
    const response = await model
      .findById(postId)
      .populate(populateModels[section]);

    if (!response) {
      return next(new HttpError("Post not found!", 404));
    }

    let isSaved = false;
    const userId = getUserIdFromRequest(req as JWTRequest);

    const { Types } = require("mongoose");

    if (userId) {
      const user = await User.findById(userId).select("saved_posts").lean();
      if (user?.saved_posts) {
        const savedField = `${snakeCase(section)}_ref`; 
        const savedPosts = user.saved_posts[savedField] || [];
        const postIdObj = new Types.ObjectId(postId);
        isSaved = savedPosts.some((savedPost) => savedPost.equals(postIdObj));
      }
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
