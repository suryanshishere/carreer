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
