import { Response, NextFunction, Request } from "express";
import HttpError from "@utils/http-errors";
import CommonModel from "@models/posts/components/Common";
import FeeModel from "@models/posts/components/Fee";
import DateModel from "@models/posts/components/Date";
import LinkModel from "@models/posts/components/Link";
import PostModel from "@models/posts/Post";
import { fetchPostDetail, fetchPostList, getTagDateLinkRef } from "./utils";
import handleValidationErrors from "@controllers/utils/validation-error";
import User from "@models/users/User";
import POST_DB, { ISectionKey, ITagKey, TAG_ORDER } from "@models/posts/db";
import postDetailByPriority from "./utils/get-detail-by-priority";

//TODO
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
  const errors = handleValidationErrors(req, next);
  if (errors) return;
  const userId = req.userData?.userId;

  try {
    const user = await User.findById(userId);
    const savedPost = user?.saved_posts || null;

    const dataPromises = POST_DB.sections.map(async (section) => {
      const savedIds = savedPost?.[section]?.map(String) || [];
      const fetchResult = await fetchPostList(section, false, next);
      if (!fetchResult) return;

      const { posts } = fetchResult;

      return {
        [section]: posts
          ?.map(({ _id, link_ref, date_ref, ...rest }) => {
            return {
              _id,
              is_saved: savedIds.includes(String(_id)),
              ...getTagDateLinkRef(date_ref, section, link_ref),
              ...rest,
            };
          })
          .sort(
            (a, b) =>
              TAG_ORDER.indexOf(a.tag as ITagKey) -
              TAG_ORDER.indexOf(b.tag as ITagKey)
          ),
      };
    });

    const dataArray = await Promise.all(dataPromises);
    const response = dataArray.reduce((acc, curr) => ({ ...acc, ...curr }), {});

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
  const errors = handleValidationErrors(req, next);
  if (errors) return;
  try {
    const section = req.params.section as ISectionKey;
    const pageParam = Number(req.query.page) || 1;

    const userId = req.userData?.userId;
    const user = await User.findById(userId);
    let savedIds: string[] = [];
    if (user) {
      if (user?.saved_posts?.[section]) {
        savedIds = user.saved_posts[section].map(String);
      }
    }

    //if not max mode then not include populate of whole data
    const includePopulate = user?.mode?.max ?? false;
    const fetchResult = await fetchPostList(
      section,
      includePopulate,
      next,
      true,
      true,
      pageParam
    );
    if (!fetchResult) return;

    const { posts: response, pageNumber } = fetchResult;

    const postsWithSavedStatus = response
      ?.map(({ _id, date_ref, link_ref, ...rest }) => {
        return {
          _id,
          ...rest,
          is_saved: savedIds.includes(String(_id)),
          ...getTagDateLinkRef(date_ref, section, link_ref),
        };
      })
      .sort(
        (a, b) =>
          TAG_ORDER.indexOf(a.tag as ITagKey) -
          TAG_ORDER.indexOf(b.tag as ITagKey)
      );

    const responseData = {
      data: { [section]: postsWithSavedStatus },
      nextPage: pageNumber ? pageNumber + 1 : null,
    };

    return res.status(200).json(responseData);
  } catch (err) {
    console.log("Error at fetching section", err);
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
    const errors = handleValidationErrors(req, next);
    if (errors) return;

    const userId = req.userData?.userId;
    const { section } = req.params as {
      section: ISectionKey;
    };

    let response = await fetchPostDetail(req, next);
    if (!response) return;

    let isSaved = false;
    if (userId) {
      const user = await User.exists({
        _id: userId,
        [`saved_posts.${section}`]: response._id,
      });

      isSaved = !!user;
    }

    const responseObject = postDetailByPriority(response.toObject(), section,response.dynamic_field);

    const { createdAt, updatedAt, _id } = response.get(`${section}_ref`);
    return res.status(200).json({
      data: responseObject,
      meta_data: {
        createdAt,
        last_updated_at: updatedAt,
        _id,
        contributors: response.get(`${section}_contributors`),
        created_by: response.get(`${section}_created_by`),
      },
      is_saved: isSaved,
    });
  } catch (err) {
    console.error(err);
    return next(
      new HttpError("An error occurred while fetching the post.", 500)
    );
  }
};
