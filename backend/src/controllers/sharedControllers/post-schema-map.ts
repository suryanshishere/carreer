import { admissionSchema } from "@models/post_models/sectionModels/admission-model";
import { admitCardSchema } from "@models/post_models/sectionModels/admit-card-model";
import { answerKeySchema } from "@models/post_models/sectionModels/answer-key-model";
import { certificateVerificationSchema } from "@models/post_models/sectionModels/certificate-verification-model";
import { importantSchema } from "@models/post_models/sectionModels/important-model";
import { latestJobSchema } from "@models/post_models/sectionModels/latest-job-model";
import { resultSchema } from "@models/post_models/sectionModels/result-model";
import { syllabusSchema } from "@models/post_models/sectionModels/syllabus-model";
import { Schema } from "mongoose";

interface ISchemaMap {
    [key: string]: Schema;
}

export const SECTION_POST_SCHEMA_MAP: ISchemaMap = {
    result: resultSchema,
    admit_card: admitCardSchema,
    latest_job: latestJobSchema,
    syllabus: syllabusSchema,
    answer_key: answerKeySchema,
    certificate_verification: certificateVerificationSchema,
    important: importantSchema,
    admission: admissionSchema,
};