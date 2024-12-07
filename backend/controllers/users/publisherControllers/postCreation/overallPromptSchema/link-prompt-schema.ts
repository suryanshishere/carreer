import { SchemaType } from "@google/generative-ai";

const linkPromptSchema = {
  description:
    "Schema representing detailed information about a post, including metadata and relevant links.",
  type: SchemaType.OBJECT,
  properties: {
    official_website: {
      type: SchemaType.STRING,
      description: "Link for the official website.",
    },
    apply_online: {
      type: SchemaType.STRING,
      description: "Link for the application form website.",
    },
    register_now: {
      type: SchemaType.STRING,
      description: "Link for the registration website.",
    },
    download_sample_papers: {
      type: SchemaType.STRING,
      description: "Link to download sample papers for the post.",
    },
    get_admit_card: {
      type: SchemaType.STRING,
      description: "Link for the admit card website.",
    },
    view_results: {
      type: SchemaType.STRING,
      description: "Link for the results website.",
    },
    check_answer_key: {
      type: SchemaType.STRING,
      description: "Link for checking the answer key.",
    },
    counseling_portal: {
      type: SchemaType.STRING,
      description: "Link for the counseling portal.",
    },
    verify_certificates: {
      type: SchemaType.STRING,
      description: "Link for certificate verification.",
    },
    additional_resources: {
      type: SchemaType.OBJECT,
      description: "Additional resources related to the post.",
      properties: {
        faq: {
          type: SchemaType.STRING,
          description: "Link to the FAQ section.",
        },
        contact_us: {
          type: SchemaType.STRING,
          description: "Link to the contact us page.",
        },
      },
      required: ["faq", "contact_us"],
    },
  },
  required: [
    "official_website",
    "apply_online",
    "register_now",
    "download_sample_papers",
    "get_admit_card",
    "view_results",
    "check_answer_key",
    "counseling_portal",
    "verify_certificates",
    "additional_resources",
  ],
};

export default linkPromptSchema;
