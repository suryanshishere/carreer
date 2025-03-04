import { admissionSchema } from "@models/post_models/sectionModels/admission_model";
import { admitCardSchema } from "@models/post_models/sectionModels/admit_card_model";
import { answerKeySchema } from "@models/post_models/sectionModels/answer_key_model";
import { certificateVerificationSchema } from "@models/post_models/sectionModels/certificate_verification_model";
import { importantSchema } from "@models/post_models/sectionModels/important_model";
import { latestJobSchema } from "@models/post_models/sectionModels/latest_job_model";
import { resultSchema } from "@models/post_models/sectionModels/result_model";
import { syllabusSchema } from "@models/post_models/sectionModels/syllabus_model";
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