import { GoogleGenerativeAI } from "@google/generative-ai";
import crypto from "crypto";
import HttpError from "@utils/http-errors";
import mongoose from "mongoose";
import { JWTRequest } from "@middleware/check-auth";
import { Request } from "express";
import {
  COMPONENT_POST_MODAL_MAP,
  SECTION_POST_MODAL_MAP,
} from "@controllers/sharedControllers/post-model-map";
import {
  COMPONENT_POST_PROMPT_SCHEMA_MAP,
  updateSchema,
} from "./post-prompt-schema-map";

export const postGeneration = async (
  apiKey: string,
  nameOfThePost: string,
  schema: { [key: string]: any }
) => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
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

export const postIdGeneration = async (postCode: string): Promise<string> => {
  const hash = crypto.createHash("sha256");
  hash.update(postCode);
  const uniqueId = hash.digest("hex");
  return uniqueId.slice(0, 24);
};

interface GeneratePostDataParams {
  keyOrSection: string;
  name_of_the_post: string;
  schema: any;
  maxAttempts?: number;
}

export const generatePostData = async ({
  keyOrSection,
  name_of_the_post,
  schema,
  maxAttempts = 2,
}: GeneratePostDataParams) => {
  let apiKey = process.env.GEMINI_API_KEY;
  let dataJson = null;
  let attemptCount = 0;

  // Retry logic
  while (attemptCount < maxAttempts) {
    // Use a different API key for "common" key or section on first attempt
    if (attemptCount === 0 && keyOrSection === "common") {
      apiKey = process.env.GEMINI_API_KEY3;
    }

    // Check if API key exists
    if (!apiKey) {
      throw new HttpError("Missing GEMINI API Key", 500);
    }

    try {
      // Attempt to generate post data
      dataJson = await postGeneration(apiKey, name_of_the_post, schema);

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
      apiKey = process.env.GEMINI_BACKUP_API_KEY;
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
  postId: string,
  req: Request,
  session: mongoose.ClientSession
) => {
  try {
    const userId = (req as JWTRequest).userData.userId;
    const { section, name_of_the_post } = req.body;

    let runCount = 0;

    // Loop through the COMPONENT_POST_MODAL_MAP and execute each key in sequence
    for (const [key, model] of Object.entries(COMPONENT_POST_MODAL_MAP)) {
      try {
        runCount++;

        let schema = COMPONENT_POST_PROMPT_SCHEMA_MAP[key];
        schema = updateSchema(schema, key, section);

        //added to remove extra processing (much needed)
        const existingComponent = await model.findById(postId).session(session);
        if (existingComponent) {
          for (const field in existingComponent.toObject()) {
            if (schema.properties[field]) {
              console.warn(`Removing field: ${field} from schema`);
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
            `Skipping post creation for key: ${key} as schema properties are empty`
          );
          continue;
        }

        const postData = await generatePostData({
          keyOrSection: key,
          name_of_the_post,
          schema,
        });

        console.log("component data generated:", postData);

        // Create or update the document
        await model.findByIdAndUpdate(
          postId,
          {
            $set: {
              created_by: userId,
              approved: true,
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
      } catch (error: any) {
        console.error(
          `Error occurred while creating component post for key: ${key}.`,
          error.message
        );

        // Wrap the error in a meaningful HttpError for the client
        throw new HttpError(
          `Component post creation failed for key: ${key}. Details: ${error.message}`,
          500
        );
      }
    }
  } catch (error: any) {
    console.error("Error in createComponentPost:", error.message);

    // Throw a final HttpError for transaction rollback
    throw new HttpError(
      `Failed to create component posts. Details: ${error.message}`,
      500
    );
  }
};
