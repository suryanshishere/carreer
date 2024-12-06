import { SchemaType } from "@google/generative-ai";

const syllabusPromptSchema = {
  description: "Detailed syllabus categorized by sections and topics",
  type: SchemaType.OBJECT,
  properties: {
    syllabus: {
      description: "An array of sections with their respective topics",
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          section: {
            type: SchemaType.STRING,
            description: "The name of the syllabus section (e.g., Mathematics, Programming)",
          },
          topics: {
            type: SchemaType.STRING,
            description: "Comma-separated topics covered under this section",
          },
        },
        required: ["section", "topics"],
      },
    },
  },
  required: ["syllabus"],
};

export default syllabusPromptSchema;
