import { SchemaType } from "@google/generative-ai";

const feePromptSchema = {
  description: "Schema representing fee details for various categories and genders.",
  type: SchemaType.OBJECT,
  properties: {
    male: {
      type: SchemaType.OBJECT,
      description: "Fee details for male candidates across various categories.",
      properties: {
        general: {
          type: SchemaType.NUMBER,
          description: "Fee for male candidates in the general category.",
        },
        obc: {
          type: SchemaType.NUMBER,
          description: "Fee for male candidates in the OBC category.",
        },
        ews: {
          type: SchemaType.NUMBER,
          description: "Fee for male candidates in the EWS category.",
        },
        sc: {
          type: SchemaType.NUMBER,
          description: "Fee for male candidates in the SC category.",
        },
        st: {
          type: SchemaType.NUMBER,
          description: "Fee for male candidates in the ST category.",
        },
        ph_dviyang: {
          type: SchemaType.NUMBER,
          description: "Fee for male candidates in the PH (Divyang) category.",
        },
      },
      required: ["general", "obc", "ews", "sc", "st", "ph_dviyang"],
    },
    female: {
      type: SchemaType.OBJECT,
      description: "Fee details for female candidates across various categories.",
      properties: {
        general: {
          type: SchemaType.NUMBER,
          description: "Fee for female candidates in the general category.",
        },
        obc: {
          type: SchemaType.NUMBER,
          description: "Fee for female candidates in the OBC category.",
        },
        ews: {
          type: SchemaType.NUMBER,
          description: "Fee for female candidates in the EWS category.",
        },
        sc: {
          type: SchemaType.NUMBER,
          description: "Fee for female candidates in the SC category.",
        },
        st: {
          type: SchemaType.NUMBER,
          description: "Fee for female candidates in the ST category.",
        },
        ph_dviyang: {
          type: SchemaType.NUMBER,
          description: "Fee for female candidates in the PH (Divyang) category.",
        },
      },
      required: ["general", "obc", "ews", "sc", "st", "ph_dviyang"],
    },
    other: {
      type: SchemaType.OBJECT,
      description: "Fee details for candidates of other genders across various categories.",
      properties: {
        general: {
          type: SchemaType.NUMBER,
          description: "Fee for candidates of other genders in the general category.",
        },
        obc: {
          type: SchemaType.NUMBER,
          description: "Fee for candidates of other genders in the OBC category.",
        },
        ews: {
          type: SchemaType.NUMBER,
          description: "Fee for candidates of other genders in the EWS category.",
        },
        sc: {
          type: SchemaType.NUMBER,
          description: "Fee for candidates of other genders in the SC category.",
        },
        st: {
          type: SchemaType.NUMBER,
          description: "Fee for candidates of other genders in the ST category.",
        },
        ph_dviyang: {
          type: SchemaType.NUMBER,
          description: "Fee for candidates of other genders in the PH (Divyang) category.",
        },
      },
      required: ["general", "obc", "ews", "sc", "st", "ph_dviyang"],
    },
    additional_resources: {
      type: SchemaType.STRING,
      description:
        "Additional information about fee details for other categories and payment modes.",
    },
  },
  required: ["male", "female", "other", "additional_resources"],
};

export default feePromptSchema;
