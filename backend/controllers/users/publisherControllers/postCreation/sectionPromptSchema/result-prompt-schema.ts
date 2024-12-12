import { SchemaType } from "@google/generative-ai";

const resultPromptSchema = {
  description: "Schema representing detailed information about the result, including instructions, categories, and cutoffs.",
  type: SchemaType.OBJECT,
  properties: {
    how_to_download_result: {
      type: SchemaType.STRING,
      description: "Step-by-step instructions to download the result.",
    },
    result: {
      type: SchemaType.OBJECT,
      description: "Result details including cutoff marks for different categories.",
      properties: {
        additional_resources: {
          type: SchemaType.STRING,
          description: "Additional information about the result or total marks and cutoff. Do not provide any links.",
        },
        general: {
          type: SchemaType.NUMBER,
          description: "Cutoff marks for the General category.",
        },
        obc: {
          type: SchemaType.NUMBER,
          description: "Cutoff marks for the OBC category.",
        },
        ews: {
          type: SchemaType.NUMBER,
          description: "Cutoff marks for the EWS category.",
        },
        sc: {
          type: SchemaType.NUMBER,
          description: "Cutoff marks for the SC category.",
        },
        st: {
          type: SchemaType.NUMBER,
          description: "Cutoff marks for the ST category.",
        },
        ph_dviyang: {
          type: SchemaType.NUMBER,
          description: "Cutoff marks for the PH (Divyang) category.",
        },
      },
      required: ["additional_resources", "general", "obc", "ews", "sc", "st", "ph_dviyang"],
    },
  },
  required: ["how_to_download_result", "result"],
};

export default resultPromptSchema;
