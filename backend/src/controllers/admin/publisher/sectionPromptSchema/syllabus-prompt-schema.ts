import { SchemaType } from "@google/generative-ai";
import { POST_LIMITS_DB } from "@models/post/post-env-db";
const { long_char_limit, short_char_limit, medium_char_limit } = POST_LIMITS_DB;

const syllabusPromptSchema = {
  description: "Detailed syllabus categorized by sections and topics",
  type: SchemaType.OBJECT,
  properties: {
    sources_and_its_step_to_download_syllabus: {
      description: `The sources from where the syllabus can be downloaded and the steps to download it, withing ${long_char_limit.min}-${long_char_limit.max} characters.`,
      type: SchemaType.STRING,
    },
    syllabus: {
      description: "An array of sections with their respective topics",
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          section: {
            type: SchemaType.STRING,
            description:
              `The name of the syllabus section (e.g., Mathematics, Programming), within ${short_char_limit.min}-${short_char_limit.max} characters.`,
          },
          topics: {
            type: SchemaType.STRING,
            description: `Comma-separated topics covered under this section, within ${long_char_limit.min}-${long_char_limit.max} characters.`,
          },
        },
        required: ["section", "topics"],
      },
    },
  },
  required: ["syllabus", "sources_and_its_step_to_download_syllabus"],
};

export default syllabusPromptSchema;
