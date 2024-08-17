import { Request, Response, NextFunction } from "express";
import HttpError from "../../utils/http-errors";
import PostAdmin from "@models/admin/postAdmin";
import { POST_SECTION_DATA } from "./admin-public-helpers";
import { convertToSnakeCase } from "@controllers/helper-controllers";
import { validationResult } from "express-validator";

// sending other data for form creation
export const postAdminData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError("The input field cannot be left empty.", 422));
    }

    const { post_section } = req.body;

    const sectionData = convertToSnakeCase(post_section);

    // console.log(categoryData)

    if (!POST_SECTION_DATA.includes(sectionData)) {
      return next(new HttpError("Invalid category", 400));
    }

    const response = await PostAdmin.find(
      { [sectionData]: false },
      "_id title"
    );

    return res.status(200).json({[sectionData]: response});
  } catch (error) {
    return next(
      new HttpError(
        "Fetching post admin data failed, please try again later.",
        500
      )
    );
  }
};
