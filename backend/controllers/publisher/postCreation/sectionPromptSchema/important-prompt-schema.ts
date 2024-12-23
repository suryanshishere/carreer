import { SchemaType } from "@google/generative-ai";

const importantPromptSchema = {
  description: "Detailed post information",
  type: SchemaType.OBJECT,
  properties: {
    how_to_fill_the_form: {
      type: SchemaType.STRING,
      description: "Step-by-step instructions for filling out the form",
    },
  },
  required: ["how_to_fill_the_form"],
};
export default importantPromptSchema;
