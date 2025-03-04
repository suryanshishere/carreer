import { admissionSchema } from "@models/post-model/post-section-model/Admission";
import { admitCardSchema } from "@models/post-model/post-section-model/AdmitCard";
import { answerKeySchema } from "@models/post-model/post-section-model/AnswerKey";
import { certificateVerificationSchema } from "@models/post-model/post-section-model/CertificateVerfication";
import { importantSchema } from "@models/post-model/post-section-model/Important";
import { latestJobSchema } from "@models/post-model/post-section-model/LatestJob";
import { resultSchema } from "@models/post-model/post-section-model/Result";
import { syllabusSchema } from "@models/post-model/post-section-model/Syllabus";
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