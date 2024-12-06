import { SchemaType } from "@google/generative-ai";

const resultPromptSchema = {
  description: "Detailed post information",
  type: SchemaType.OBJECT,
  properties: {
    how_to_download_result: {
      type: SchemaType.STRING,
      description: "Steps to download the result"
    },
    result: {
      type: SchemaType.OBJECT,
      properties: {
        additional_resources: {
          type: SchemaType.STRING,
          description:
            "Additional result resources or provide me total mark out of which is cutoff declared (don't provide me the links)",
        },
        male: {
          type: SchemaType.OBJECT,
          properties: {
            general: { type: SchemaType.NUMBER },
            obc: { type: SchemaType.NUMBER },
            ews: { type: SchemaType.NUMBER },
            sc: { type: SchemaType.NUMBER },
            st: { type: SchemaType.NUMBER },
            ph_dviyang: { type: SchemaType.NUMBER },
          },
        },
        female: {
          type: SchemaType.OBJECT,
          properties: {
            general: { type: SchemaType.NUMBER },
            obc: { type: SchemaType.NUMBER },
            ews: { type: SchemaType.NUMBER },
            sc: { type: SchemaType.NUMBER },
            st: { type: SchemaType.NUMBER },
            ph_dviyang: { type: SchemaType.NUMBER },
          },
        },
      },
    },
  },
  required: ["how_to_download_result", "result"],
};

export default resultPromptSchema;
