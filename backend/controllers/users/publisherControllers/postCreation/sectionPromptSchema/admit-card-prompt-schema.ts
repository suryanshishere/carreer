import { SchemaType } from "@google/generative-ai";

const admitCardPromptSchema = {
  description: "Detailed information about the admit card and download instructions",
  type: SchemaType.OBJECT,
  properties: {
    how_to_download_admit_card: {
      type: SchemaType.STRING,
      description: "Step-by-step instructions to download the admit card",
    },
  },
  required: ["how_to_download_admit_card"],
};

export default admitCardPromptSchema;
