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

export const SECTION_DESCRIPTIONS: Record<string, string> = {
  result:
    "An engaging title for the post related to exam results, clearly conveying the purpose and outcome of the section.",
  admit_card:
    "A descriptive and attention-grabbing name for the post, highlighting essential admit card information for candidates.",
  latest_job:
    "An informative and compelling post title about job opportunities, designed to attract attention for job seekers.",
  answer_key:
    "A descriptive title for the post, focusing on providing clear and precise information about the answer key for the exam.",
  syllabus:
    "An engaging and detailed post name that provides essential syllabus details and exam preparation guidance.",
  certificate_verification:
    "A clear and concise post title, aimed at informing about certificate verification requirements or updates.",
  admission:
    "An engaging and well-crafted title for the post, centered on admission-related updates and guidance.",
  important:
    "An impactful title for the post, emphasizing critical and urgent information about the relevant section.",
};

export const postCreation = async (
  nameOfThePost: string,
  schema: { [key: string]: any }
) => {
  try {
    // Validate the schema argument to ensure it's a valid object
    if (Object.keys(schema).length === 0) {
      console.error("Schema cannot be empty");
      return null; // Return null for controlled error handling
    }

    // Initialize Google Generative AI with the provided API key
    if (!process.env.GEMINI_API_KEY) {
      console.error("Missing GEMINI API Key");
      return null; // Return null for controlled error handling
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
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
    console.error("Post Creation Error:", error);
    return null; // Return null to signal an error occurred
  }
};

// Helper function to parse the generated content
const parseGeneratedContent = (content: string) => {
  try {
    const parsedContent = JSON.parse(content);
    return parsedContent;
  } catch (syntaxError) {
    console.error("JSON Syntax Error in generated content:", syntaxError);
    console.error("Generated content:", content);
    return null;
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

    // Loop through the COMPONENT_POST_MODAL_MAP and execute each key in sequence
    for (const [key, model] of Object.entries(COMPONENT_POST_MODAL_MAP)) {
      try {
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

        console.log("schema updated:", schema);

        // Check if schema properties are empty
        if (Object.keys(schema.properties).length === 0) {
          console.log(
            `Skipping post creation for key: ${key} as schema properties are empty`
          );
          continue;
        }

        const dataJson = await postCreation(name_of_the_post, schema);
        if (!dataJson) {
          console.error("Post creation failed for:", key);
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
