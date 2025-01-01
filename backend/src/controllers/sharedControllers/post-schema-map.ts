import { admissionSchema } from "src/models/post/sectionModels/admission-model";
import { admitCardSchema } from "src/models/post/sectionModels/admit-card-model";
import { answerKeySchema } from "src/models/post/sectionModels/answer-key-model";
import { certificateVerificationSchema } from "src/models/post/sectionModels/certificate-verification-model";
import { importantSchema } from "src/models/post/sectionModels/important-model";
import { latestJobSchema } from "src/models/post/sectionModels/latest-job-model";
import { resultSchema } from "src/models/post/sectionModels/result-model";
import { syllabusSchema } from "src/models/post/sectionModels/syllabus-model";
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