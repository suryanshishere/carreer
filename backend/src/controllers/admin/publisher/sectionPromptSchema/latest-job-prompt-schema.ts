import { SchemaType } from "@google/generative-ai";

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
          description: "Step-by-step instructions for registering for the post",
        },
        apply: {
          type: SchemaType.STRING,
          description: "Step-by-step instructions for applying to the post after registration",
        },
      },
      required: ["registration", "apply"],
    },
  },
  required: ["how_to_fill_the_form"],
};

export default latestJobPromptSchema;
