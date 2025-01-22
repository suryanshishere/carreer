import { SchemaType } from "@google/generative-ai";
import { POST_LIMITS } from "@shared/env-data";

const { short_char_limit } = POST_LIMITS;

const linkPromptSchema = {
  description: `Generate a real link for each of the following fields.`,
  type: SchemaType.OBJECT,
  properties: {
    official_website: {
      type: SchemaType.STRING,
      description: `Official website link of the post or organization, within ${short_char_limit.min}-${short_char_limit.max} characters.`,
    },
    apply_online: {
      type: SchemaType.STRING,
      description: `Link to the online application form, within ${short_char_limit.min}-${short_char_limit.max} characters. `,
    },
    register_now: {
      type: SchemaType.STRING,
      description: `Link for registration, within ${short_char_limit.min}-${short_char_limit.max} characters.`,
    },
    download_sample_papers: {
      type: SchemaType.STRING,
      description:`Link to download sample papers for preparation, within ${short_char_limit.min}-${short_char_limit.max} characters.`,
    },
    get_admit_card: {
      type: SchemaType.STRING,
      description: `Link to download the admit card, within ${short_char_limit.min}-${short_char_limit.max} characters.`,
    },
    view_results: {
      type: SchemaType.STRING,
      description: `Link to check results, within ${short_char_limit.min}-${short_char_limit.max} characters.`,
    },
    check_answer_key: {
      type: SchemaType.STRING,
      description: `Real link to view or download the answer key, within ${short_char_limit.min}-${short_char_limit.max} characters.`,
    },
    counseling_portal: {
      type: SchemaType.STRING,
      description: `Real link to access the counseling portal, within ${short_char_limit.min}-${short_char_limit.max} characters.`,
    },
    verify_certificates: {
      type: SchemaType.STRING,
      description: `Real link for verifying certificates, within ${short_char_limit.min}-${short_char_limit.max} characters.`,
    },
    additional_resources: {
      type: SchemaType.OBJECT,
      description: "Additional resources related to the post.",
      properties: {
        faq: {
          type: SchemaType.STRING,
          description: `Real link to the FAQ section, within ${short_char_limit.min}-${short_char_limit.max} characters.`,
        },
        contact_us: {
          type: SchemaType.STRING,
          description: `Real link to the Contact Us page, within ${short_char_limit.min}-${short_char_limit.max} characters.`,
        },
      },
      required: ["faq"],
    },
  },
  required: ["additional_resources", "official_website"],
};

export default linkPromptSchema;
