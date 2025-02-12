import { SchemaType } from "@google/generative-ai";
import { POST_LIMITS_DB } from "@models/post/post-env-db";

const certificateVerificationPromptSchema = {
  description: "Detailed post information for certificate verification process",
  type: SchemaType.OBJECT,
  properties: {
    how_to_fill_the_form: {
      type: SchemaType.STRING,
      description: `Step-by-step instructions to fill the certificate verification form, within ${POST_LIMITS_DB.long_char_limit.min}-${POST_LIMITS_DB.long_char_limit.max} characters.`,
    },
  },
  required: ["how_to_fill_the_form"],
};

export default certificateVerificationPromptSchema;
