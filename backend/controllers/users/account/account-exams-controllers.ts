import { Request, Response, NextFunction } from "express";
import HttpError from "../../../util/http-errors";
import User from "../../../models/user/user";
import ExamList from "../../../models/exam/list";
import ExamDetail from "../../../models/exam/detail";

export const getSaveExam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params.userId;

  try {
    const userSavedExam = await User.findById(userId)
      .select("_id saved")
      .populate("saved");

    if (!userSavedExam) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Check if the user has saved exams
    if (!userSavedExam.saved || userSavedExam.saved.length === 0) {
      return res.status(404).json({ message: "User has no saved exams." });
    }

    res.status(200).json(userSavedExam.saved);
  } catch (error) {
    return next(
      new HttpError("Fetching saved exams failed, please try again later.", 500)
    );
  }
};

export const saveExam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;
  const { examId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const examExists = await ExamList.exists({ _id: examId });
    if (!examExists) {
      return res.status(404).json({ message: "Exam not found!" });
    }

    const alreadySavedIndex = user.saved.findIndex((savedExam) => {
      if (savedExam) {
        return savedExam.toString() === examId;
      }
      return false;
    });

    if (alreadySavedIndex !== -1) {
      return res.status(400).json({ message: "Exam already saved" });
    }

    user.saved.push(examId);
    await user.save();

    await ExamList.updateOne(
      { _id: examId },
      { $addToSet: { saved_users: userId } }
    );

    return res.status(200).json({ message: "Exam saved!" });
  } catch (err) {
    console.log(err);
    return next(
      new HttpError("Saving exam failed, please try again later.", 500)
    );
  }
};

export const removeExam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;
  const { examId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Check if the examId exists in the user's saved exams
    const index = user.saved.findIndex(
      (savedExam) => savedExam.toString() === examId
    );
    if (index === -1) {
      return res
        .status(400)
        .json({ message: "Exam not found in saved exams!" });
    }

    user.saved.splice(index, 1);
    await user.save();

    await ExamList.updateOne(
      { _id: examId },
      { $pull: { saved_users: userId } }
    );

    return res.status(200).json({ message: "Exam removed!" });
  } catch (error) {
    return next(
      new HttpError("Removing exam failed, please try again later.", 500)
    );
  }
};


export const createExam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;
  const { examFormData } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const newDetailPage = new ExamDetail({
      author: userId, // or any other author identifier
      related_detail_page: examFormData, // Ensure examFormData is structured correctly
    });

    await newDetailPage.save();

   
    const newExam = new ExamList({
   
    });

    await newExam.save();

    return res.status(200).json({ message: "Exam created successfully!" });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Creating exam failed, please try again later.", 500)
    );
  }
};

