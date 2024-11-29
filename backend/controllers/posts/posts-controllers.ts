import { Response, NextFunction } from "express";
import PostDate from "@models/post/common/postDate";
import PostFee from "@models/post/common/postFee";
import PostLink from "@models/post/common/postLink";
import PostCommon from "@models/post/common/postCommon";
import Post from "@models/post/post-model";
import HttpError from "@utils/http-errors";
import { fetchPosts, populateModels, MODEL_DATA } from "./posts-populate";
import { convertToSnakeCase } from "@controllers/controllersHelpers/case-convert";
import { Request } from "express-jwt";
import User from "@models/user/user-model";
import { snakeCase } from "lodash";
import { Types } from "mongoose";
import { getUserIdFromRequest } from "@middleware/check-auth";

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
export const getPostHomeList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getUserIdFromRequest(req);

    // Fetch the user's saved_posts data only if the userId is present
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

// Get the list of posts for a specific category
export const getPostCategoryList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { category } = req.params;

  try {
    const userId = getUserIdFromRequest(req);

    // Check if the category is valid
    const model = MODEL_DATA[category];
    if (!model) {
      return next(new HttpError("Invalid category specified.", 400));
    }

    // Fetch posts for the specified category
    const response = await fetchPosts(model, CATEGORY_LIMIT);

    // Check if the user is authenticated and fetch saved posts for the category
    let savedIds: string[] = [];
    if (userId) {
      const user = await User.findById(userId).select("saved_posts").lean();
      const savedField = `${snakeCase(category)}_ref`; // Convert category to snake_case and append `_ref`

      if (user?.saved_posts?.[savedField]) {
        savedIds = user.saved_posts[savedField].map(String); // Extract saved IDs for the category
      }
    }

    // Map posts and add `is_saved` field based on the user's saved posts
    const postsWithSavedStatus = response.map(
      ({ name_of_the_post, post_code, _id }) => ({
        name_of_the_post,
        post_code,
        _id,
        is_saved: savedIds.includes(String(_id)), // Check if the post is saved
      })
    );

    // Structure the response
    const responseData = {
      data: { [snakeCase(category)]: postsWithSavedStatus },
    };
    return res.status(200).json(responseData);
  } catch (err) {
    console.error("Error fetching posts for category:", err);
    return next(new HttpError("An error occurred while fetching posts!", 500));
  }
};

// Get the detailed information of a specific post
export const getPostDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { category, postId } = req.params;

  try {
    const model = MODEL_DATA[category];
    if (!model) {
      return next(new HttpError("Invalid category specified.", 400));
    }

    // Fetch post details
    const response = await model
      .findById(postId)
      .populate(populateModels[category]);

    if (!response) {
      return next(new HttpError("Post not found!", 404));
    }

    // Add is_saved field if user is authenticated
    let isSaved = false;
    const userId = getUserIdFromRequest(req);

    const { Types } = require("mongoose");

    if (userId) {
      const user = await User.findById(userId).select("saved_posts").lean();
      if (user?.saved_posts) {
        const savedField = `${snakeCase(category)}_ref`; // Convert category to snake_case and append `_ref`
        // console.log(savedField); // Debug the field name

        const savedPosts = user.saved_posts[savedField] || [];
        // console.log(savedPosts); // Debug the array of saved post IDs

        // Use new keyword to create ObjectId
        const postIdObj = new Types.ObjectId(postId); // Convert postId to ObjectId

        // Use `.equals()` for ObjectId comparison
        isSaved = savedPosts.some((savedPost) => savedPost.equals(postIdObj));

        // console.log(isSaved); // Check if isSaved is correctly set to true or false
      }
    }

    // Attach the `is_saved` field to the response
    const responseWithSavedStatus = {
      data: response.toObject(),
      is_saved: isSaved,
    };

    return res.status(200).json(responseWithSavedStatus);
  } catch (err) {
    console.error(
      `Error fetching post detail for postId ${postId} in category ${category}:`,
      err
    );
    return next(
      new HttpError("An error occurred while fetching the post", 500)
    );
  }
};
