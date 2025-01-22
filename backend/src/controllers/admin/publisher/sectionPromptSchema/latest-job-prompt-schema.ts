import { SchemaType } from "@google/generative-ai";
import { POST_LIMITS } from "@shared/env-data";

const { long_char_limit, short_char_limit } = POST_LIMITS;

const latestJobPromptSchema = {
  description: "Detailed post information for the latest job",
  type: SchemaType.OBJECT,
  properties: {
    how_to_fill_the_form: {
      type: SchemaType.OBJECT,
      description: "Detailed steps for filling out the job application form",
      properties: {
        registration: {
          type: SchemaType.STRING,
          description: `Step-by-step instructions for registering for the post, within ${long_char_limit.min}-${long_char_limit.max} characters.`,
        },
        apply: {
          type: SchemaType.STRING,
          description: `Step-by-step instructions for applying to the post after registration, within ${long_char_limit.min}-${long_char_limit.max} characters.`,
        },
        video_link: {
          type: SchemaType.STRING,
          description: `Link to a youtube video tutorial for filling out the form of the post, within ${short_char_limit.min}-${short_char_limit.max} characters.`,
        },
      },
      required: ["registration", "apply"],
    },
  },
  required: ["how_to_fill_the_form"],
};

export default latestJobPromptSchema;
