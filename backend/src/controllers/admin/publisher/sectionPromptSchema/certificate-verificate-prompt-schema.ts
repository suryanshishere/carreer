import { SchemaType } from "@google/generative-ai";

const certificateVerificationPromptSchema = {
  description: "Detailed post information for certificate verification process",
  type: SchemaType.OBJECT,
  properties: {
    how_to_fill_the_form: {
      type: SchemaType.STRING,
      description: "Step-by-step instructions to fill the certificate verification form",
    },
  },
  required: ["how_to_fill_the_form"],
};

export default certificateVerificationPromptSchema;
