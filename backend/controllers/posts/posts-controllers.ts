import { Request, Response, NextFunction } from "express";
import Admission from "@models/post/category/postAdmission";
import AdmitCard from "@models/post/category/postAdmitCard";
import CertificateVerification from "@models/post/category/postCertificateVerification";
import PostImportant from "@models/post/category/postImportant";
import LatestJob from "@models/post/category/postLatestJob";
import Result from "@models/post/category/postResult";
import Syllabus from "@models/post/category/postSyllabus";
import PostDate from "@models/post/overall/postDate";
import PostFee from "@models/post/overall/postFee";
import PostLink from "@models/post/overall/postLink";
import PostCommon from "@models/post/postCommon";
import Post from "@models/post/postModel";
import AnswerKey from "@models/post/category/postAnswerKey";
import { Model } from "mongoose";
import HttpError from "@utils/http-errors";

//no. of the item (.env)

export const getPostHomeList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dataPromises = Object.keys(models).map(async (key) => {
      const model = models[key];
      const posts = await fetchPosts(model);
      return {
        [key]: posts.map(({ name_of_the_post, post_code, _id }) => ({
          name_of_the_post,
          post_code,
          _id,
        })),
      };
    });

    const dataArray = await Promise.all(dataPromises);

    const response = dataArray.reduce((acc, curr) => {
      return { ...acc, ...curr };
    }, {});

    return res.status(200).json(response);
  } catch (err) {
    return next(new HttpError("An error occurred while fetching posts", 500));
  }
};

export const getPostCategoryList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { category } = req.params;
  try {
    const response = await fetchPosts(models[category], 30);
    const responseData = {category: response}
    return res.status(200).json(responseData);
  } catch (err) {
    return next(new HttpError("An error occurred while fetching posts", 500));
  }
};

export const getPostDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

// -------------------------------------- helper

// Define the PostModel interface
interface PostModel extends Model<any> {}

// Define the type for models
type Models = {
  [key: string]: PostModel;
};

// Fetch posts function
const fetchPosts = async (Model: PostModel, limit: number = 15) => {
  return Model.find({})
    .sort({ last_updated: -1 })
    .limit(limit)
    .select("name_of_the_post post_code _id")
    .exec();
};

const models: Models = {
  result: Result,
  admit_card: AdmitCard,
  latest_job: LatestJob,
  syllabus: Syllabus,
  answer_key: AnswerKey,
  certificate_verification: CertificateVerification,
  important: PostImportant,
  admission: Admission,
};
