import HttpError from "@utils/http-errors";
import { NextFunction } from "express";
import crypto from "crypto";
import PublisherModal from "@models/admin/request-model";
import AdminModel from "@models/admin/admin-model";

export const checkAuthorisedPublisher = async (
  publisherId: string,
  next: NextFunction
) => {
  // try {
  //   let publisher = await PublisherModal.findById(publisherId!);
  //   if (!publisher) {
  //     const admin = await AdminModel.findById(publisherId!);
  //     if (!admin || !["handlePublisher", "ultimate"].includes(admin.status)) {
  //       return next(new HttpError("Publisher or Admin not found!", 404));
  //     }
  //   }
  // } catch (error) {
  //   return next(
  //     new HttpError(
  //       "An error occurred while checking the publisher or admin.",
  //       500
  //     )
  //   );
  // }
};

export const postIdGeneration = async (postCode: string): Promise<string> => {
  const hash = crypto.createHash("sha256");
  hash.update(postCode);
  const uniqueId = hash.digest("hex");
  return uniqueId.slice(0, 24);
};
