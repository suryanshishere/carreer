import { SchemaType } from "@google/generative-ai";
import { POST_LIMITS_DB } from "@models/post-model/post-db";

const answerKeyPromptSchema = {
  description: "Detailed information about downloading the answer key",
  type: SchemaType.OBJECT,
  properties: {
    how_to_download_answer_key: {
      type: SchemaType.STRING,
      description: `Step-by-step instructions to download the answer key, within ${POST_LIMITS_DB.long_char_limit.min}-${POST_LIMITS_DB.long_char_limit.max} characters.`,
    },
  },
  required: ["how_to_download_answer_key"],
};

export default answerKeyPromptSchema;
