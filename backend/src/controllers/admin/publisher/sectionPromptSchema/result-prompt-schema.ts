import { SchemaType } from "@google/generative-ai";
import { POST_LIMITS } from "@shared/env-data";

const { long_char_limit, short_char_limit, non_negative_num } = POST_LIMITS;

const resultCategory = {
  additional_resources: {
    type: SchemaType.STRING,
    description: `Additional result context such as total marks, normalization, or post-exam details within ${short_char_limit.min}-${short_char_limit.max} characters. No links allowed.`,
  },
  general: {
    type: SchemaType.NUMBER,
    description: `Cutoff marks for the General category, within ${non_negative_num.min}-${non_negative_num.max} range.`,
  },
  obc: {
    type: SchemaType.NUMBER,
    description: `Cutoff marks for the OBC category, within ${non_negative_num.min}-${non_negative_num.max} range.`,
  },
  ews: {
    type: SchemaType.NUMBER,
    description: ` Cutoff marks for the EWS category, within ${non_negative_num.min}-${non_negative_num.max} range.`,
  },
  sc: {
    type: SchemaType.NUMBER,
    description: `"Cutoff marks for the SC category, within ${non_negative_num.min}-${non_negative_num.max} range.`,
  },
  st: {
    type: SchemaType.NUMBER,
    description: ` Cutoff marks for the ST category, within ${non_negative_num.min}-${non_negative_num.max} range.`,
  },
  ph_dviyang: {
    type: SchemaType.NUMBER,
    description: `Cutoff marks for the PH (Divyang) category, within ${non_negative_num.min}-${non_negative_num.max} range.`,
  },
};

const resultPromptSchema = {
  description:
    "Schema representing detailed information about the result, including instructions, categories, and cutoffs.",
  type: SchemaType.OBJECT,
  properties: {
    how_to_download_result: {
      type: SchemaType.STRING,
      description: `Step-by-step instructions to download the result, within ${long_char_limit.min}-${long_char_limit.max} characters.`,
    },
    result: {
      type: SchemaType.OBJECT,
      description:
        "Year-wise result details, including cutoff marks for different categories.",
      properties: {
        current_year: {
          type: SchemaType.OBJECT,
          description: "Cutoff details for the current year.",
          properties: resultCategory,
        },
        previous_year: {
          type: SchemaType.OBJECT,
          description: "Cutoff details for the previous year (mandatory).",
          properties: resultCategory,
          required: ["additional_resources", "general"],
        },
      },
      required: ["previous_year"],
    },
  },
  required: ["how_to_download_result", "result"],
};

export default resultPromptSchema;
