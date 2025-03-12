import { admissionSchema } from "@models/post-model/sections/Admission";
import { admitCardSchema } from "@models/post-model/sections/AdmitCard";
import { answerKeySchema } from "@models/post-model/sections/AnswerKey";
import { certificateVerificationSchema } from "@models/post-model/sections/CertificateVerfication";
import { importantSchema } from "@models/post-model/sections/Important";
import { latestJobSchema } from "@models/post-model/sections/LatestJob";
import { resultSchema } from "@models/post-model/sections/Result";
import { syllabusSchema } from "@models/post-model/sections/Syllabus";
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