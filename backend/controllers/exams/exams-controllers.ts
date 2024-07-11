import { Request, Response, NextFunction } from "express";
import ExamDetail from "../../models/exam/examDetail";
import ExamList, { IExamListDocument } from "../../models/exam/examModel";
import HttpError from "../../util/http-errors";
import { Types } from "mongoose";
import { getCategoryData, getExcludedData, hashStringToObjectId } from "./exams-helpers";

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
    res.status(200).json(responseData);
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

    res.status(200).json(responseData);
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

  // string is hash, taken first 24 of it's digit and search over the details
  const examId = hashStringToObjectId(req.params.examId);

  try {
    const examWithDetails = await ExamDetail.findById(examId);

    if (!examWithDetails) {
      return next(new HttpError("Could not find an exam!", 404));
    }

    if (!examWithDetails) {
      return next(new HttpError("This exam does not have any details.", 404));
    }

    // Now you have the exam details populated
    res.json(examWithDetails);
  } catch (err) {
    const error = new HttpError(
      "Fetching exam details failed, please try again later.",
      500
    );
    return next(error);
  }
};
