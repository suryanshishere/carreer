import  POST_DB  from "@models/post_models/post_db";
import { camelCase } from "lodash";
import resultPromptSchema from "./sectionPromptSchema/result-prompt-schema";
import admitCardPromptSchema from "./sectionPromptSchema/admit-card-prompt-schema";
import latestJobPromptSchema from "./sectionPromptSchema/latest-job-prompt-schema";
import syllabusPromptSchema from "./sectionPromptSchema/syllabus-prompt-schema";
import answerKeyPromptSchema from "./sectionPromptSchema/answer-key-prompt-schema";
import certificateVerificationPromptSchema from "./sectionPromptSchema/certificate-verificate-prompt-schema";
import importantPromptSchema from "./sectionPromptSchema/important-prompt-schema";
import admissionPromptSchema from "./sectionPromptSchema/admission-prompt-schema";
import feePromptSchema from "./componentPromptSchema/fee-prompt-schema";
import datePromptSchema from "./componentPromptSchema/date-prompt-schema";
import linkPromptSchema from "./componentPromptSchema/link-prompt-schema";
import commonPromptSchema from "./componentPromptSchema/common-prompt-schema";

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

// Dynamically map section prompts
const SECTION_POST_PROMPT_SCHEMA_MAP: ISectionPromptSchema =
  POST_DB.sections.reduce((acc, key) => {
    const camelKey = camelCase(key);
    const promptKey = `${camelKey}PromptSchema`;
    if (OVERALL_PROMPT[promptKey]) {
      acc[key] = OVERALL_PROMPT[promptKey];
    } else {
      console.warn(
        `Prompt schema "${promptKey}" not found for section "${key}".`
      );
    }
    return acc;
  }, {} as ISectionPromptSchema);

// Dynamically map component prompts
const COMPONENT_POST_PROMPT_SCHEMA_MAP: ISectionPromptSchema =
  POST_DB.components.reduce((acc, key) => {
    const camelKey = camelCase(key);
    const promptKey = `${camelKey}PromptSchema`;
    if (OVERALL_PROMPT[promptKey]) {
      acc[key] = OVERALL_PROMPT[promptKey];
    } else {
      console.warn(
        `Prompt schema "${promptKey}" not found for component "${key}".`
      );
    }
    return acc;
  }, {} as ISectionPromptSchema);

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
