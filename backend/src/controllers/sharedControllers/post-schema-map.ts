import { admissionSchema } from "@models/post/sectionModels/admission-model";
import { admitCardSchema } from "@models/post/sectionModels/admit-card-model";
import { answerKeySchema } from "@models/post/sectionModels/answer-key-model";
import { certificateVerificationSchema } from "@models/post/sectionModels/certificate-verification-model";
import { importantSchema } from "@models/post/sectionModels/important-model";
import { latestJobSchema } from "@models/post/sectionModels/latest-job-model";
import { resultSchema } from "@models/post/sectionModels/result-model";
import { syllabusSchema } from "@models/post/sectionModels/syllabus-model";
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