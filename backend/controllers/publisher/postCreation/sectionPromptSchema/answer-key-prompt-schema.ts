import { SchemaType } from "@google/generative-ai";

const answerKeyPromptSchema = {
  description: "Detailed information about downloading the answer key",
  type: SchemaType.OBJECT,
  properties: {
    how_to_download_answer_key: {
      type: SchemaType.STRING,
      description: "Step-by-step instructions to download the answer key",
    },
  },
  required: ["how_to_download_answer_key"],
};

export default answerKeyPromptSchema;