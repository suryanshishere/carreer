import { SchemaType } from "@google/generative-ai";
import { POST_LIMITS_ENV_DB } from "@models/post/post-env-db";

const admitCardPromptSchema = {
  description:
    "Detailed information about the admit card and download instructions",
  type: SchemaType.OBJECT,
  properties: {
    how_to_download_admit_card: {
      type: SchemaType.STRING,
      description: `Step-by-step instructions to download the admit card, within ${POST_LIMITS_ENV_DB.long_char_limit.min}-${POST_LIMITS_ENV_DB.long_char_limit.max} characters.`,
    },
  },
  required: ["how_to_download_admit_card"],
};

export default admitCardPromptSchema;
