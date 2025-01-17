import { SchemaType } from "@google/generative-ai";

const feePromptSchema = {
  description:
    "Schema representing fee details for various categories and genders in Indian rupees.",
  type: SchemaType.OBJECT,
  properties: {
    category_wise: {
      type: SchemaType.OBJECT,
      description: "Fee details for male candidates across various categories.",
      properties: {
        general: {
          type: SchemaType.NUMBER,
        },
        obc: {
          type: SchemaType.NUMBER,
        },
        ews: {
          type: SchemaType.NUMBER,
        },
        sc: {
          type: SchemaType.NUMBER,
        },
        st: {
          type: SchemaType.NUMBER,
        },
        ph_dviyang: {
          type: SchemaType.NUMBER,
        },
      },
      required: ["general", "obc", "ews", "sc", "st", "ph_dviyang"],
    },
    female: {
      type: SchemaType.NUMBER,
      description: "Fee for female candidates.",
    },
    male: {
      type: SchemaType.NUMBER,
      description: "Fee for male candidates (display the general category fee here).",
    },
    additional_resources: {
      type: SchemaType.STRING,
      description:
        "Additional information about fee details for other categories and payment modes.",
    },
  },
  required: ["category_wise"],
};

export default feePromptSchema;
