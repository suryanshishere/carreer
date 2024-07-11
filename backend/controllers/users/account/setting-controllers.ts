import { Request, Response, NextFunction } from "express";
// import HttpError from "../../../util/http-errors";
// import Account, { IAccount } from "../../../models/account";
// import { validationResult } from "express-validator";
// import bcrypt from "bcryptjs";
// import {
//   checkValidationResult,
//   handleUnknownServerError,
//   handleUserNotFound,
//   handleUserSignupRequired,
// } from "../../helper-controllers";

export const getAccountInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
 
};

export const editAccountInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const deactivateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const deactivateAt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const reactivateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
