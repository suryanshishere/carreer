import { SchemaType } from "@google/generative-ai";
import { POST_LIMITS_DB } from "@models/post_models/posts_db";

const { non_negative_num, short_char_limit } = POST_LIMITS_DB;
 

const feePromptSchema = {
  description: `Fee details for various categories and genders in Indian rupees. If limits not provided then assume for strings, length should be between ${short_char_limit.min} and ${short_char_limit.max} characters, and for numbers, the value should be between ${non_negative_num.min} and ${non_negative_num.max}.`,
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
    },
    female: {
      type: SchemaType.NUMBER,
      description: `Fee for female candidates, within ${non_negative_num.min}-${non_negative_num.max} range.`,
    },
    male: {
      type: SchemaType.NUMBER,
      description:
        `Fee for male candidates (display the general category fee here), within ${non_negative_num.min}-${non_negative_num.max} range.`,
    },
    additional_resources: {
      type: SchemaType.STRING,
      description: `Additional information about fee details for other categories and payment modes, within ${short_char_limit.min}-${short_char_limit.max} characters.`,
    },
  },
  required: ["additional_resources"],
};

export default feePromptSchema;
