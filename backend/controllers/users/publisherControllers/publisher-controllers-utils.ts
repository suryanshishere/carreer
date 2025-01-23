import HttpError from "@utils/http-errors";
import { Response, NextFunction, Request } from "express";
import crypto from "crypto";
import mongoose from "mongoose";
import { JWTRequest } from "@middleware/check-auth";
import { postComponentArray } from "shared/post-array";
import { POST_PROMPT_SCHEMA } from "./postCreation/post-prompt-schema";
import postCreation from "./postCreation/postCreation";
import { MODAL_MAP } from "@controllers/controllersUtils/post-model-map";

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

// export const checkOverall = async (
//   postObjectId: mongoose.Types.ObjectId,
//   userObjectId: mongoose.Types.ObjectId,
//   nameOfThePost: string,
//   next: NextFunction,
//   session: mongoose.ClientSession
// ) => {
//   try {
//     for (const item of postComponentArray) {
//       const itemModel = MODAL_MAP[item];
//       if (!itemModel) {
//         throw new HttpError("Internal server error: Missing model", 500);
//       }

//       const post = await itemModel.findById(postObjectId).session(session);
//       if (!post) {
//         const schema = POST_PROMPT_SCHEMA[item];
//         if (Object.keys(schema).length === 0) {
//           throw new HttpError("Internal server error: Missing schema", 500);
//         }

//         const dataJson = await postCreation(nameOfThePost, schema, next);
//         if (!dataJson) {
//           throw new HttpError("Error creating dataJson", 500);
//         }

//         const newPost = new itemModel({
//           _id: postObjectId,
//           created_by: userObjectId,
//           approved: true,
//           ...dataJson,
//         });

//         console.log(newPost)

//         await newPost.save({ session });
//       }
//     }
//   } catch (err) {
//     console.error("Error in checkOverall:", err);
//     throw err;
//   }
// };
