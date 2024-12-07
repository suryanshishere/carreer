import { NextFunction, Response, Request } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import resultPromptSchema from "./sectionPromptSchema/result-prompt-schema";
import admitCardPromptSchema from "./sectionPromptSchema/admit-card-prompt-schema";
import latestJobPromptSchema from "./sectionPromptSchema/latest-job-prompt-schema";
import syllabusPromptSchema from "./sectionPromptSchema/syllabus-prompt-schema";
import answerKeyPromptSchema from "./sectionPromptSchema/answer-key-prompt-schema";
import certificateVerificatePromptSchema from "./sectionPromptSchema/certificate-verificate-prompt-schema";
import importantPromptSchema from "./sectionPromptSchema/important-prompt-schema";
import admissionPromptSchema from "./sectionPromptSchema/admission-prompt-schema";
import { snakeCase } from "lodash";

interface ISectionPromptSchema {
  [key: string]: { [key: string]: any };
}

export const sectionPromptSchema: ISectionPromptSchema = {
  result: resultPromptSchema,
  admit_card: admitCardPromptSchema,
  latest_job: latestJobPromptSchema,
  syllabus: syllabusPromptSchema,
  answer_key: answerKeyPromptSchema,
  certificate_verification: certificateVerificatePromptSchema,
  important: importantPromptSchema,
  admission: admissionPromptSchema,
};

const postCreation = async (
  nameOfThePost: string,
  schema: { [key: string]: any },
  next: NextFunction
) => {
  try {
    const genAI = new GoogleGenerativeAI(
      "AIzaSyBoMIuLaeFI6-qIlAoSz4S8a-CP31K65SQ"
    );
    //  process.env.GEMINI_API_KEY ||

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
    const parsedContent = JSON.parse(generatedContent);

    return parsedContent;
  } catch (error) {
    console.error("Error generating post content:", error);
    // res.status(500).json({ error: "Failed to generate post content" });
  }
};

export default postCreation;
