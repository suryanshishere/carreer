import { Request, Response, NextFunction } from "express";
import PostDate from "@models/post/overall/postDate";
import PostFee from "@models/post/overall/postFee";
import PostLink from "@models/post/overall/postLink";
import PostCommon from "@models/post/section/postCommon";
import Post from "@models/post/post-model";
import HttpError from "@utils/http-errors";
import { fetchPosts, populateModels, MODEL_DATA } from "./posts-populate";
import { convertToSnakeCase } from "@controllers/controllersHelpers/case-convert";

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
    const dataPromises = Object.keys(MODEL_DATA).map(async (key) => {
      const model = MODEL_DATA[key];
      const posts = await fetchPosts(model, HOME_LIMIT);
      return {
        [convertToSnakeCase(key)]: posts.map(
          ({ name_of_the_post, post_code, _id }) => ({
            name_of_the_post,
            post_code,
            _id,
          })
        ),
      };
    });

    const dataArray = await Promise.all(dataPromises);

    const response = dataArray.reduce((acc, curr) => {
      return { ...acc, ...curr };
    }, {});

    return res.status(200).json(response);
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
    const model = MODEL_DATA[category];
    if (!model) {
      return next(new HttpError("Invalid category specified", 400));
    }

    const response = await fetchPosts(model, CATEGORY_LIMIT);
    const responseData = { [category]: response };

    return res.status(200).json(responseData);
  } catch (err) {
    console.error(`Error fetching posts for category ${category}:`, err);
    return next(new HttpError("An error occurred while fetching posts", 500));
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
      return next(new HttpError("Invalid category specified", 400));
    }

    const response = await model
      .findById(postId)
      .populate(populateModels[category]);

    if (!response) {
      return next(new HttpError("Post not found", 404));
    }

    return res.status(200).json(response);
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
