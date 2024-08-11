import { Request, Response, NextFunction } from "express";
import HttpError from "../../utils/http-errors";

// sending other data for form creation
export const adminExamData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
   

  
  } catch (error) {
    return next(
      new HttpError(
        "Getting admin exam data failed, please try again later.",
        500
      )
    );
  }
};
