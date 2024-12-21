import resultPromptSchema from "./sectionPromptSchema/result-prompt-schema";
import admitCardPromptSchema from "./sectionPromptSchema/admit-card-prompt-schema";
import latestJobPromptSchema from "./sectionPromptSchema/latest-job-prompt-schema";
import syllabusPromptSchema from "./sectionPromptSchema/syllabus-prompt-schema";
import answerKeyPromptSchema from "./sectionPromptSchema/answer-key-prompt-schema";
import certificateVerificatePromptSchema from "./sectionPromptSchema/certificate-verificate-prompt-schema";
import importantPromptSchema from "./sectionPromptSchema/important-prompt-schema";
import admissionPromptSchema from "./sectionPromptSchema/admission-prompt-schema";
import feePromptSchema from "./componentPromptSchema/fee-prompt-schema";
import datePromptSchema from "./componentPromptSchema/date-prompt-schema";
import linkPromptSchema from "./componentPromptSchema/link-prompt-schema";
import commonPromptSchema from "./componentPromptSchema/common-prompt-schema";

interface ISectionPromptSchema {
  [key: string]: { [key: string]: any };
}

export const SECTION_POST_PROMPT_SCHEMA_MAP: ISectionPromptSchema = {
  result: resultPromptSchema,
  admit_card: admitCardPromptSchema,
  latest_job: latestJobPromptSchema,
  syllabus: syllabusPromptSchema,
  answer_key: answerKeyPromptSchema,
  certificate_verification: certificateVerificatePromptSchema,
  important: importantPromptSchema,
  admission: admissionPromptSchema,
};

export const COMPONENT_POST_PROMPT_SCHEMA_MAP: ISectionPromptSchema = {
  fee: feePromptSchema,
  date: datePromptSchema,
  link: linkPromptSchema,
  common: commonPromptSchema,
};

export const SECTION_DESCRIPTIONS: Record<string, string> = {
  result:
    "An engaging title for the post related to exam results, clearly conveying the purpose and outcome of the section.",
  admit_card:
    "A descriptive and attention-grabbing name for the post, highlighting essential admit card information for candidates.",
  latest_job:
    "An informative and compelling post title about job opportunities, designed to attract attention for job seekers.",
  answer_key:
    "A descriptive title for the post, focusing on providing clear and precise information about the answer key for the exam.",
  syllabus:
    "An engaging and detailed post name that provides essential syllabus details and exam preparation guidance.",
  certificate_verification:
    "A clear and concise post title, aimed at informing about certificate verification requirements or updates.",
  admission:
    "An engaging and well-crafted title for the post, centered on admission-related updates and guidance.",
  important:
    "An impactful title for the post, emphasizing critical and urgent information about the relevant section.",
};
