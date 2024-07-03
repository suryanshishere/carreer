import { Request, Response, NextFunction } from "express";
import ExamDetail from "../../models/exam/detail";
import ExamList, { IExamListDocument } from "../../models/exam/list";
import HttpError from "../../util/http-errors";
import { Types } from "mongoose";

export const getExam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userid } = req.headers;
    const responseData = await ExamList.find({}, getExcludedData(!!userid));

    if (!responseData) {
      const error = "No data found!";
      return next(new HttpError(error, 404));
    }

    if (userid) {
      const responseDataWithBookmark = responseData.map(
        (exam: IExamListDocument) => addBookmarkToExam(exam, userid as string)
      );
      res.status(200).json(responseDataWithBookmark);
    } else {
      res.status(200).json(responseData);
    }
  } catch (err) {
    const error = new HttpError(
      "Fetching exams failed, please try again later.",
      500
    );
    return next(error);
  }
};

export const getCategoryExam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const category = req.params.category;
  try {
    const { userid } = req.headers;
    const responseData = await ExamList.find(
      { category: category },
      getCategoryData(!!userid)
    );

    if (!responseData || responseData.length === 0) {
      return res
        .status(404)
        .json({ message: "No exams found for the specified category" });
    }

    if (userid) {
      const responseDataWithBookmark = responseData.map(
        (exam: IExamListDocument) => addBookmarkToExam(exam, userid as string)
      );
      res.status(200).json(responseDataWithBookmark);
    } else {
      res.status(200).json(responseData);
    }
  } catch (err) {
    const error = new HttpError(
      "Fetching exam category failed, please try again later.",
      500
    );
    return next(error);
  }
};

export const getDetailByExamId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const examId = req.params.examId;

  try {
    const examWithDetails = await ExamList.findById(examId).populate("detail");

    if (!examWithDetails) {
      return next(new HttpError("Could not find an exam!", 404));
    }

    if (!examWithDetails.detail) {
      return next(new HttpError("This exam does not have any details.", 404));
    }

    // Now you have the exam details populated
    res.json(examWithDetails.detail);
  } catch (err) {
    const error = new HttpError(
      "Fetching exam details failed, please try again later.",
      500
    );
    return next(error);
  }
};

// helper function -----------------------------------

const getExcludedData = (includeSavedUsers: boolean) => {
  return includeSavedUsers
    ? { detail_title: 0, detail: 0 }
    : { detail_title: 0, detail: 0, saved_users: 0 };
};

const getCategoryData = (includeSavedUsers: boolean) => {
  return includeSavedUsers
    ? { category_title: 0 }
    : { category_title: 0, saved_users: 0 };
};

const addBookmarkToExam = (exam: IExamListDocument, userid: string) => {
  const objectId = new Types.ObjectId(userid);
  const isSavedByUser = exam.saved_users.includes(objectId);
  const examWithBookmark = {
    ...exam.toObject(),
    bookmarked: isSavedByUser,
  };
  delete examWithBookmark.saved_users;
  return examWithBookmark;
};
