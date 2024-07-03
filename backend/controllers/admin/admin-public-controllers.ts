import { Request, Response, NextFunction } from "express";
import HttpError from "../../util/http-errors";
import Admin from "../../models/admin/admin";

// sending other data for form creation
export const adminExamData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminData = await Admin.findOne().lean();
    const { userid } = req.headers;

    if (!adminData) {
      return res.status(404).json({ message: "Admin data not found" });
    }

    // Remove count fields from all except exam_code
    const removeCountField = (data: any[]) => {
      return data.map((item) => {
        const { count, ...rest } = item;
        return rest;
      });
    };

    // unverified user can still have acess to the home list
    if (!userid) {
      return res
        .status(200)
        .json({ category: removeCountField(adminData.category) });
    }

    const formattedData = {
      exam_code: adminData.exam_code, // Keep count field for exam_code
      exam_conducting_body: removeCountField(adminData.exam_conducting_body),
      exam_mode: removeCountField(adminData.exam_mode),
      exam_level: removeCountField(adminData.exam_level),
      state_and_union: removeCountField(adminData.state_and_union),
      job_type: removeCountField(adminData.job_type),
      syllabus: removeCountField(adminData.syllabus),
      category: removeCountField(adminData.category),
      eligibility__minimun_qualification: removeCountField(adminData.eligibility__minimun_qualification),
      vacancy__gender_applicant: removeCountField(adminData.vacancy__gender_applicant),
    };

    // Send the formatted data to the frontend
    res.status(200).json(formattedData);
  } catch (error) {
    return next(
      new HttpError(
        "Getting admin exam data failed, please try again later.",
        500
      )
    );
  }
};
