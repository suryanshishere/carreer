import resultPromptSchema from "./sectionPromptSchema/result-prompt-schema";
import admitCardPromptSchema from "./sectionPromptSchema/admit-card-prompt-schema";
import latestJobPromptSchema from "./sectionPromptSchema/latest-job-prompt-schema";
import syllabusPromptSchema from "./sectionPromptSchema/syllabus-prompt-schema";
import answerKeyPromptSchema from "./sectionPromptSchema/answer-key-prompt-schema";
import certificateVerificatePromptSchema from "./sectionPromptSchema/certificate-verificate-prompt-schema";
import importantPromptSchema from "./sectionPromptSchema/important-prompt-schema";
import admissionPromptSchema from "./sectionPromptSchema/admission-prompt-schema";
import feePromptSchema from "./overallPromptSchema/fee-prompt-schema";
import datePromptSchema from "./overallPromptSchema/date-prompt-schema";
import linkPromptSchema from "./overallPromptSchema/link-prompt-schema";
import commonPromptSchema from "./overallPromptSchema/common-prompt-schema";


interface ISectionPromptSchema {
    [key: string]: { [key: string]: any };
  }
  
 export const POST_PROMPT_SCHEMA: ISectionPromptSchema = {
    result: resultPromptSchema,
    admit_card: admitCardPromptSchema,
    latest_job: latestJobPromptSchema,
    syllabus: syllabusPromptSchema,
    answer_key: answerKeyPromptSchema,
    certificate_verification: certificateVerificatePromptSchema,
    important: importantPromptSchema,
    admission: admissionPromptSchema,
    fee: feePromptSchema,
    date: datePromptSchema,
    link: linkPromptSchema,
    common: commonPromptSchema,
  };