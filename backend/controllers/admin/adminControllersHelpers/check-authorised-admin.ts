import AuthorisedAdmin from "@models/admin/authorisedAdmin";
import HttpError from "@utils/http-errors";
import { NextFunction } from "express";

const checkAuthorisedAdmin = async (
  userid: string | string[] | undefined,
  next: NextFunction
) => {
  if (userid === undefined) {
    return next(new HttpError("Unauthorized access.", 403));
  }
  try {
    const user = await AuthorisedAdmin.findById(userid);
    if (!user) {
      // Return the next function call to ensure the flow stops here
      return next(new HttpError("Unauthorized access.", 403));
    }
  } catch (error) {
    // Also return the next function call here
    return next(
      new HttpError("Error occurred while finding an authorized admin!", 404)
    );
  }
};

export default checkAuthorisedAdmin;
