import { admissionSchema } from "@models/posts/sections/Admission";
import { admitCardSchema } from "@models/posts/sections/AdmitCard";
import { answerKeySchema } from "@models/posts/sections/AnswerKey";
import { certificateVerificationSchema } from "@models/posts/sections/CertificateVerfication";
import { importantSchema } from "@models/posts/sections/Important";
import { latestJobSchema } from "@models/posts/sections/LatestJob";
import { resultSchema } from "@models/posts/sections/Result";
import { syllabusSchema } from "@models/posts/sections/Syllabus";
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