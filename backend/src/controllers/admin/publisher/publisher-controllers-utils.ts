import resultPromptSchema from "./sectionPromptSchema/result-prompt-schema";
import admitCardPromptSchema from "./sectionPromptSchema/admit-card-prompt-schema";
import latestJobPromptSchema from "./sectionPromptSchema/latest-job-prompt-schema";
import syllabusPromptSchema from "./sectionPromptSchema/syllabus-prompt-schema";
import answerKeyPromptSchema from "./sectionPromptSchema/answer-key-prompt-schema";
import certificateVerificatePromptSchema from "./sectionPromptSchema/certificate-verificate-prompt-schema";
import importantPromptSchema from "./sectionPromptSchema/important-prompt-schema";
import admissionPromptSchema from "./sectionPromptSchema/admission-prompt-schema";
import feePromptSchema from "./componentPromptSchema/fee-prompt-schema";
import datePromptSchema from "./componentPromptSchema/date-prompt-schema";
import linkPromptSchema from "./componentPromptSchema/link-prompt-schema";
import commonPromptSchema from "./componentPromptSchema/common-prompt-schema";
import { GoogleGenerativeAI } from "@google/generative-ai";
import crypto from "crypto";
import HttpError from "@utils/http-errors";
import { updateSchema } from "@controllers/posts/postsControllersUtils/post-sort-map";
import mongoose from "mongoose";
import { JWTRequest } from "@middleware/check-auth";
import { Request } from "express";
import { COMPONENT_POST_MODAL_MAP } from "@controllers/sharedControllers/post-model-map";

interface ISectionPromptSchema {
  [key: string]: { [key: string]: any };
}

export const SECTION_POST_PROMPT_SCHEMA_MAP: ISectionPromptSchema = {
  result: resultPromptSchema,
  admit_card: admitCardPromptSchema,
  latest_job: latestJobPromptSchema,
  syllabus: syllabusPromptSchema,
  answer_key: answerKeyPromptSchema,
  certificate_verification: certificateVerificatePromptSchema,
  important: importantPromptSchema,
  admission: admissionPromptSchema,
};

export const COMPONENT_POST_PROMPT_SCHEMA_MAP: ISectionPromptSchema = {
  fee: feePromptSchema,
  date: datePromptSchema,
  link: linkPromptSchema,
  common: commonPromptSchema,
};

export const postCreation = async (
  apiKey: string,
  nameOfThePost: string,
  schema: { [key: string]: any }
) => {
  try {
    // Validate the schema argument to ensure it's a valid object
    if (Object.keys(schema).length === 0) {
      throw new HttpError("Schema cannot be empty.", 500);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    // Generate the content for the post
    const prompt = `Generate a comprehensive and engaging post for the "${nameOfThePost}"`;
    const result = await model.generateContent(prompt);

    // Ensure the result is in the correct format (JSON)
    const generatedContent = result.response.text();
    const parsedContent = parseGeneratedContent(generatedContent);

    return parsedContent; // Successfully parsed content
  } catch (error) {
    throw new HttpError(`${error}`, 500);
  }
};

// Helper function to parse the generated content
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

//TODO: what if one of the component exist
export const createComponentPost = async (
  postId: string,
  req: Request,
  session: mongoose.ClientSession
) => {
  try {
    const userId = (req as JWTRequest).userData.userId;
    const { section, name_of_the_post } = req.body;

    let runCount = 0; // Counter to track the number of iterations

    // Loop through the COMPONENT_POST_MODAL_MAP and execute each key in sequence
    for (const [key, model] of Object.entries(COMPONENT_POST_MODAL_MAP)) {
      try {
        runCount++; // Increment the counter on each iteration

        if (!model) {
          throw new HttpError(`Model not found for key: ${key}`, 400);
        }

        let schema = COMPONENT_POST_PROMPT_SCHEMA_MAP[key];
        if (!schema) {
          throw new HttpError(`Schema not found for key: ${key}`, 400);
        }
        schema = updateSchema(schema, key, section);

        const existingComponent = await model.findById(postId).session(session);
        if (existingComponent) {
          // Remove fields related to the existing component from the schema
          for (const field in existingComponent.toObject()) {
            if (schema.properties[field]) {
              console.log(`Removing field: ${field} from schema`);
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
          console.log(
            `Skipping post creation for key: ${key} as schema properties are empty`
          );
          continue;
        }

        let apiKey = process.env.GEMINI_API_KEY;
        let dataJson = null;
        let attemptCount = 0;
        let success = false;

        // Retry up to 2 times if no data is returned
        while (attemptCount < 2 && !success) {
          if (attemptCount === 0 && key === "common") {
            apiKey = process.env.GEMINI_API_KEY3;
          }
          if (!apiKey) {
            throw new HttpError("Missing GEMINI API Key", 500);
          }

          try {
            dataJson = await postCreation(apiKey, name_of_the_post, schema);
          } catch (error: any) {
            throw new HttpError(error.message, 500);
          }

          if (dataJson) {
            success = true; // Exit the retry loop on success
          } else {
            attemptCount++;
            console.error(
              `Post creation failed for key: ${key}. Attempt ${attemptCount}/2`
            );
            if (attemptCount < 2) {
              // Swap API keys: use backup API if no data is returned
              apiKey = process.env.GEMINI_BACKUP_API_KEY;
            }
          }
        }

        if (!dataJson) {
          console.error("Post creation failed after 2 attempts for:", key);
          throw new HttpError("Post creation returned no data", 500);
        }

        console.log("component data generated:", dataJson);

        // Create or update the document
        await model.findByIdAndUpdate(
          postId,
          {
            $set: {
              created_by: userId,
              approved: true,
              ...dataJson,
            },
          },
          {
            new: true,
            upsert: true,
            session,
          }
        );
      } catch (error) {
        console.error(
          `Error occurred in component post creation for key: ${key}`,
          error
        );
        throw error; // Propagate the error to abort the entire operation
      }
    }
  } catch (error) {
    console.error("Error in createComponentPost:", error);
    throw error; // Propagate the error to allow transaction rollback
  }
};
