import { NextFunction, Response, Request } from "express";
const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

const postCreation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name_of_the_post } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

    // Define a schema for structured response
    const schema = resultPromptSchema;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    // Use the name_of_the_post dynamically in the prompt
    const prompt = `Generate a detailed post for "${name_of_the_post}". Include steps to download the result, statistical breakdowns by category, and any important links or dates.`;

    const result = await model.generateContent(prompt);
    const generatedContent = await result.response.text();
    const parsedContent = JSON.parse(generatedContent);
    return parsedContent;
  } catch (error) {
    console.error("Error generating post content:", error);
    // res.status(500).json({ error: "Failed to generate post content" });
  }
};

export default postCreation;

const resultPromptSchema = {
  description: "Detailed post information",
  type: SchemaType.OBJECT,
  properties: {
    how_to_download_result: {
      type: SchemaType.STRING,
      description: "Steps to download the result",
      nullable: true,
    },
    result: {
      type: SchemaType.OBJECT,
      properties: {
        additional_resources: {
          type: SchemaType.STRING,
          description:
            "Additional result resources or provide me total mark out of which is cutoff declared (don't provide me the links)",
        },
        male: {
          type: SchemaType.OBJECT,
          properties: {
            general: { type: SchemaType.NUMBER },
            obc: { type: SchemaType.NUMBER },
            ews: { type: SchemaType.NUMBER },
            sc: { type: SchemaType.NUMBER },
            st: { type: SchemaType.NUMBER },
            ph_dviyang: { type: SchemaType.NUMBER },
          },
        },
        female: {
          type: SchemaType.OBJECT,
          properties: {
            general: { type: SchemaType.NUMBER },
            obc: { type: SchemaType.NUMBER },
            ews: { type: SchemaType.NUMBER },
            sc: { type: SchemaType.NUMBER },
            st: { type: SchemaType.NUMBER },
            ph_dviyang: { type: SchemaType.NUMBER },
          },
        },
      },
    },
  },
  required: ["how_to_download_result", "result"],
};
