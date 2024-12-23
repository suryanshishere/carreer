import { NextFunction } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const postCreation = async (
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

export default postCreation;
