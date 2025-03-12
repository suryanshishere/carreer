import { GoogleGenerativeAI } from "@google/generative-ai";
import crypto from "crypto";
import HttpError from "@utils/http-errors";
import mongoose from "mongoose";
import { JWTRequest } from "@middlewares/check-auth";
import { Request } from "express";
import { COMPONENT_POST_MODEL_MAP } from "@models/post-model/db/post-map/post-model-map";
import {
  COMPONENT_POST_PROMPT_SCHEMA_MAP,
  updateSchema,
} from "./post-prompt-schema-map";
import PostModel, { IPost } from "@models/post-model/Post";

export const postGeneration = async (
  api_key_from_user: string,
  nameOfThePost: string,
  schema: { [key: string]: any }
) => {
  try {
    const genAI = new GoogleGenerativeAI(api_key_from_user);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      // model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const prompt = `Generate a comprehensive and engaging post for the "${nameOfThePost}"`;
    const result = await model.generateContent(prompt);

    const generatedContent = result.response.text();
    const parsedContent = parseGeneratedContent(generatedContent);

    return parsedContent;
  } catch (error) {
    throw new HttpError(`${error}`, 500);
  }
};

const parseGeneratedContent = (content: string) => {
  try {
    const parsedContent = JSON.parse(content);
    return parsedContent;
  } catch (syntaxError) {
    throw new HttpError(`${syntaxError}`, 500);
  }
};

// export const postIdGeneration = async (postCode: string): Promise<string> => {
//   const hash = crypto.createHash("sha256");
//   hash.update(postCode);
//   const uniqueId = hash.digest("hex");
//   return uniqueId.slice(0, 24);
// };

interface GeneratePostDataParams {
  keyOrSection: string;
  name_of_the_post: string;
  schema: any;
  maxAttempts?: number;
  api_key_from_user?: string;
}

export const generatePostData = async ({
  keyOrSection,
  name_of_the_post,
  schema,
  maxAttempts = 2,
  api_key_from_user,
}: GeneratePostDataParams) => {
  let apiKeyDefault = process.env.GEMINI_API_KEY;
  let dataJson = null;
  let attemptCount = 0;

  // Retry logic
  while (attemptCount < maxAttempts) {
    // Use a different API key for "common" key or section on first attempt
    if (attemptCount === 0 && keyOrSection === "common") {
      console.warn("using api key from user: ", api_key_from_user);
      apiKeyDefault = api_key_from_user || process.env.GEMINI_API_KEY3;
    }

    // Check if API key exists
    if (!apiKeyDefault) {
      throw new HttpError("Missing GEMINI API Key", 500);
    }

    try {
      // Attempt to generate post data
      dataJson = await postGeneration(apiKeyDefault, name_of_the_post, schema);

      // If data is successfully returned, return it
      if (dataJson) {
        return dataJson;
      }
    } catch (error: any) {
      // Log error message and throw a new HttpError if it fails
      console.error(
        `Error during post creation attempt ${
          attemptCount + 1
        } for ${keyOrSection}: ${error.message}`
      );
      throw new HttpError(error.message, 500);
    }

    // Increment attempt counter and log retry information
    attemptCount++;
    console.error(
      `Post creation failed for ${keyOrSection}. Attempt ${attemptCount}/${maxAttempts}`
    );

    // Switch to backup API key for subsequent attempts
    if (attemptCount < maxAttempts) {
      api_key_from_user = process.env.GEMINI_BACKUP_API_KEY;
    }
  }

  // Log failure after max retry attempts and throw an error
  console.error(
    `Post creation failed after ${maxAttempts} attempts for ${keyOrSection}`
  );
  throw new HttpError("Post creation returned no data after retries", 500);
};

// ------------------------------------------------------------------------------------

//TODO: what if one of the component exist
//remove schema checking rather make the system to work or roll back completly

export const createComponentPost = async (
  req: Request,
  session: mongoose.ClientSession,
  api_key_from_user?: string
): Promise<{ postId: mongoose.Types.ObjectId; postDoc: IPost }> => {
  try {
    const userId = (req as JWTRequest).userData.userId;
    const { section, name_of_the_post, post_code, version } = req.body;

    const queryFilter = { post_code, version: version ?? "main" };
    let postDoc = await PostModel.findOne(queryFilter).session(session);

    // If not found, create a new PostModel document (auto _id will be generated)
    if (!postDoc) {
      postDoc = new PostModel(queryFilter);
      await postDoc.save({ session });
    }

    const currentPostId = postDoc._id; // Use this auto-generated ID for components.

    let runCount = 0;

    // Step 2: Loop through each component key in COMPONENT_POST_MODEL_MAP.
    for (const [key, model] of Object.entries(COMPONENT_POST_MODEL_MAP)) {
      try {
        runCount++;

        // Get and update the schema for this component.
        let schema = COMPONENT_POST_PROMPT_SCHEMA_MAP[key];
        schema = updateSchema(schema, key, section);

        //TODO: having some bug here 
        if (Object.keys(schema.properties).length === 0) {
          throw new HttpError(`Internal server error!`, 500);
        }

        // If a component document already exists, remove its fields from the schema.
        const existingComponent = await model
          .findById(currentPostId)
          .session(session);
        if (existingComponent) {
          for (const field in existingComponent.toObject()) {
            if (schema.properties[field]) {
              console.warn(
                `Removing field: ${field} from schema for key: ${key}`
              );
              delete schema.properties[field];
            }
            if (schema.required && schema.required.includes(field)) {
              schema.required = schema.required.filter(
                (requiredField: string) => requiredField !== field
              );
            }
          }
        }
        if (Object.keys(schema.properties).length === 0) {
          console.warn(
            `Skipping component creation for key: ${key} as schema properties are empty`
          );
          continue;
        }

        // Generate component-specific post data.
        const postData = await generatePostData({
          keyOrSection: key,
          name_of_the_post,
          schema,
          api_key_from_user,
        });

        console.log(`Component data generated for ${key}:`, postData);

        // Step 3: Create or update the component document using the same _id as PostModel.
        await model.findByIdAndUpdate(
          currentPostId,
          {
            $set: {
              ...postData,
            },
          },
          {
            new: true,
            upsert: true,
            session,
            runValidators: true,
          }
        );

        // Step 4: Update the PostModel document's reference for this component.
        await PostModel.findByIdAndUpdate(
          currentPostId,
          {
            $set: {
              [`${key}_created_by`]: userId,
              // Store the component document's _id (here we assume it's the same as currentPostId)
              // If your component documents generate separate IDs, adjust accordingly.
              [`${key}_ref`]: currentPostId,
            },
          },
          { session, upsert: true }
        );
      } catch (error: any) {
        console.error(
          `Error occurred while creating component post for key: ${key}.`,
          error.message
        );
        throw new HttpError(
          `Component post creation failed for key: ${key}.`,
          500
        );
      }
    }

    return { postId: currentPostId, postDoc };
  } catch (error: any) {
    console.error("Error in createComponentPost:", error.message);
    throw new HttpError(`Failed to create component posts.`, 500);
  }
};
