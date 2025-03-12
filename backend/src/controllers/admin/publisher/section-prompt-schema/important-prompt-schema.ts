import { SchemaType } from "@google/generative-ai";
import { POST_LIMITS_DB } from "@models/posts/db";

const importantPromptSchema = {
  description: "Detailed post information",
  type: SchemaType.OBJECT,
  properties: {
    how_to_fill_the_form: {
      type: SchemaType.STRING,
      description: `Step-by-step instructions for filling out the form, withing ${POST_LIMITS_DB.long_char_limit.min}-${POST_LIMITS_DB.long_char_limit.max} characters.`,
    },
  },
  required: ["how_to_fill_the_form"],
};
export default importantPromptSchema;
