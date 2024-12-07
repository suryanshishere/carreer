import HttpError from "@utils/http-errors";
import { Response, NextFunction, Request } from "express";
import crypto from "crypto";
import mongoose from "mongoose";
import { JWTRequest } from "@middleware/check-auth";
import { postOverallArray } from "@controllers/shared/post-array";
import { POST_PROMPT_SCHEMA } from "./postCreation/post-prompt-schema";
import postCreation from "./postCreation/postCreation";
import { MODAL_MAP } from "@controllers/shared/post-model-map";

export const checkAuthorisedPublisher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as JWTRequest).user;
  if (user.role != "publisher") {
    return next(new HttpError("Unauthorized access!", 403));
  }
};

export const postIdGeneration = async (postCode: string): Promise<string> => {
  const hash = crypto.createHash("sha256");
  hash.update(postCode);
  const uniqueId = hash.digest("hex");
  return uniqueId.slice(0, 24);
};

export const checkOverall = async (
  postObjectId: mongoose.Types.ObjectId,
  userObjectId: mongoose.Types.ObjectId,
  nameOfThePost: string,
  next: NextFunction
) => {
  try {
    for (const item of postOverallArray) {
      const itemModel = MODAL_MAP[item];
      if (!itemModel) {
        return next(new HttpError("Internal server error: Missing model", 500));
      }

      const post = await itemModel.findById(postObjectId);
      if (!post) {
        const schema = POST_PROMPT_SCHEMA[item];
        if (Object.keys(schema).length === 0) {
          return next(
            new HttpError("Internal server error: Missing schema", 500)
          );
        }

        const dataJson = await postCreation(nameOfThePost, schema, next);
        if (!dataJson) {
          return next(new HttpError("Error creating dataJson", 500));
        }

        const newPost = new itemModel({
          _id: postObjectId,
          created_by: userObjectId,
          approved: true,
          ...dataJson,
        });

        if (item === "link") {
          console.log(newPost); // Now this should be logged properly
        }

        await newPost.save();
      }
    }
  } catch (err) {
    console.log("overall cool", err);
    return next(
      new HttpError("Error occurred while creating for overall post", 500)
    );
  }
};
