import POST_DB from "@models/posts/db";
import { camelCase } from "lodash";
import resultPromptSchema from "./section-prompt-schema/result-prompt-schema";
import admitCardPromptSchema from "./section-prompt-schema/admit-card-prompt-schema";
import latestJobPromptSchema from "./section-prompt-schema/latest-job-prompt-schema";
import syllabusPromptSchema from "./section-prompt-schema/syllabus-prompt-schema";
import answerKeyPromptSchema from "./section-prompt-schema/answer-key-prompt-schema";
import certificateVerificationPromptSchema from "./section-prompt-schema/certificate-verificate-prompt-schema";
import importantPromptSchema from "./section-prompt-schema/important-prompt-schema";
import admissionPromptSchema from "./section-prompt-schema/admission-prompt-schema";
import feePromptSchema from "./component-prompt-schema/fee-prompt-schema";
import datePromptSchema from "./component-prompt-schema/date-prompt-schema";
import linkPromptSchema from "./component-prompt-schema/link-prompt-schema";
import commonPromptSchema from "./component-prompt-schema/common-prompt-schema";

interface ISectionPromptSchema {
  [key: string]: { [key: string]: any };
}

const OVERALL_PROMPT: ISectionPromptSchema = {
  resultPromptSchema,
  admitCardPromptSchema,
  latestJobPromptSchema,
  syllabusPromptSchema,
  answerKeyPromptSchema,
  certificateVerificationPromptSchema,
  importantPromptSchema,
  admissionPromptSchema,
  feePromptSchema,
  datePromptSchema,
  linkPromptSchema,
  commonPromptSchema,
};

// Utility function to map section/component prompts dynamically
const mapPromptSchema = (keys: string[]): ISectionPromptSchema =>
  keys.reduce((acc, key) => {
    const promptKey = `${camelCase(key)}PromptSchema`;
    if (OVERALL_PROMPT[promptKey]) {
      acc[key] = OVERALL_PROMPT[promptKey];
    } else {
      console.warn(`Prompt schema "${promptKey}" not found for "${key}".`);
    }
    return acc;
  }, {} as ISectionPromptSchema);

const SECTION_POST_PROMPT_SCHEMA_MAP = mapPromptSchema(POST_DB.sections);
const COMPONENT_POST_PROMPT_SCHEMA_MAP = mapPromptSchema(POST_DB.components);

export { SECTION_POST_PROMPT_SCHEMA_MAP, COMPONENT_POST_PROMPT_SCHEMA_MAP };

const dateRequiredMap: Record<string, string[]> = {
  result: [
    "result_announcement_date",
    "answer_key_release_date",
    "result_announcement_date",
    "counseling_start_date",
    "counseling_end_date",
    "counseling_result_announcement_date",
  ],
  latest_job: ["application_start_date", "application_end_date"],
  answer_key: ["answer_key_release_date"],
  syllabus: ["application_start_date", "application_end_date"],
  certificate_verification: ["certificate_verification_date"],
  admission: [
    "counseling_start_date",
    "counseling_end_date",
    "counseling_result_announcement_date",
  ],
  important: ["important_date"],
  admit_card: ["admit_card_release_date", "exam_date"],
};

const linkRequiredMap: Record<string, string[]> = {
  result: ["view_results"],
  latest_job: ["apply_online"],
  answer_key: ["check_answer_key"],
  syllabus: ["download_sample_papers"],
  certificate_verification: ["verify_certificates"],
  admission: ["counseling_portal"],
  important: ["faq", "contact_us"],
  admit_card: ["get_admit_card"],
};

export const updateSchema = (
  schema: any,
  key: string,
  section: string
): any => {
  if (key === "date") {
    return {
      ...schema,
      required: [...(schema.required || []), ...dateRequiredMap[section]],
    };
  } else if (key === "link") {
    return {
      ...schema,
      required: [
        ...(schema.required || []),
        ...linkRequiredMap[section],
        "official_website",
      ],
    };
  }
  return schema;
};
