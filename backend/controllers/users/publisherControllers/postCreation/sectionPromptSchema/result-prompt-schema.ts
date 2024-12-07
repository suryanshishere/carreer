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
      description: "Result details including cutoff marks for different categories and genders.",
      properties: {
        additional_resources: {
          type: SchemaType.STRING,
          description:
            "Additional information about the result or total marks and cutoff. Do not provide any links.",
        },
        male: {
          type: SchemaType.OBJECT,
          description: "Cutoff marks for male candidates across various categories.",
          properties: {
            general: {
              type: SchemaType.NUMBER,
              description: "Cutoff marks for male candidates in the General category.",
            },
            obc: {
              type: SchemaType.NUMBER,
              description: "Cutoff marks for male candidates in the OBC category.",
            },
            ews: {
              type: SchemaType.NUMBER,
              description: "Cutoff marks for male candidates in the EWS category.",
            },
            sc: {
              type: SchemaType.NUMBER,
              description: "Cutoff marks for male candidates in the SC category.",
            },
            st: {
              type: SchemaType.NUMBER,
              description: "Cutoff marks for male candidates in the ST category.",
            },
            ph_dviyang: {
              type: SchemaType.NUMBER,
              description: "Cutoff marks for male candidates in the PH (Divyang) category.",
            },
          },
          required: ["general", "obc", "ews", "sc", "st", "ph_dviyang"],
        },
        female: {
          type: SchemaType.OBJECT,
          description: "Cutoff marks for female candidates across various categories.",
          properties: {
            general: {
              type: SchemaType.NUMBER,
              description: "Cutoff marks for female candidates in the General category.",
            },
            obc: {
              type: SchemaType.NUMBER,
              description: "Cutoff marks for female candidates in the OBC category.",
            },
            ews: {
              type: SchemaType.NUMBER,
              description: "Cutoff marks for female candidates in the EWS category.",
            },
            sc: {
              type: SchemaType.NUMBER,
              description: "Cutoff marks for female candidates in the SC category.",
            },
            st: {
              type: SchemaType.NUMBER,
              description: "Cutoff marks for female candidates in the ST category.",
            },
            ph_dviyang: {
              type: SchemaType.NUMBER,
              description: "Cutoff marks for female candidates in the PH (Divyang) category.",
            },
          },
          required: ["general", "obc", "ews", "sc", "st", "ph_dviyang"],
        },
      },
      required: ["additional_resources", "male", "female"],
    },
  },
  required: ["how_to_download_result", "result"],
};

export default resultPromptSchema;
