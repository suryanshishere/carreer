import { SchemaType } from "@google/generative-ai";
import { POST_LIMITS } from "@shared/env-data";

const { short_char_limit } = POST_LIMITS;

const linkPromptSchema = {
  description: `If limits not provided then assume for strings, length should be between ${short_char_limit.min} and ${short_char_limit.max} characters.`,
  type: SchemaType.OBJECT,
  properties: {
    official_website: {
      type: SchemaType.STRING,
      description: "Official website link of the post or organization. ",
    },
    apply_online: {
      type: SchemaType.STRING,
      description: "Link to the online application form. ",
    },
    register_now: {
      type: SchemaType.STRING,
      description: "Link for registration. ",
    },
    download_sample_papers: {
      type: SchemaType.STRING,
      description: "Link to download sample papers for preparation. ",
    },
    get_admit_card: {
      type: SchemaType.STRING,
      description: "Link to download the admit card. ",
    },
    view_results: {
      type: SchemaType.STRING,
      description: "Link to check results. ",
    },
    check_answer_key: {
      type: SchemaType.STRING,
      description: "Real link to view or download the answer key. ",
    },
    counseling_portal: {
      type: SchemaType.STRING,
      description: "Real link to access the counseling portal. ",
    },
    verify_certificates: {
      type: SchemaType.STRING,
      description: "Real link for verifying certificates. ",
    },
    additional_resources: {
      type: SchemaType.OBJECT,
      description: "Additional resources related to the post.",
      properties: {
        faq: {
          type: SchemaType.STRING,
          description: "Real link to the FAQ section. ",
        },
        contact_us: {
          type: SchemaType.STRING,
          description: "Real link to the Contact Us page. ",
        },
      },
      required: ["faq", "contact_us"],
    },
  },
  required: ["additional_resources"],
};

export default linkPromptSchema;
