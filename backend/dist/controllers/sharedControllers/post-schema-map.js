"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECTION_POST_SCHEMA_MAP = void 0;
const admission_model_1 = require("src/models/post/sectionModels/admission-model");
const admit_card_model_1 = require("src/models/post/sectionModels/admit-card-model");
const answer_key_model_1 = require("src/models/post/sectionModels/answer-key-model");
const certificate_verification_model_1 = require("src/models/post/sectionModels/certificate-verification-model");
const important_model_1 = require("src/models/post/sectionModels/important-model");
const latest_job_model_1 = require("src/models/post/sectionModels/latest-job-model");
const result_model_1 = require("src/models/post/sectionModels/result-model");
const syllabus_model_1 = require("src/models/post/sectionModels/syllabus-model");
exports.SECTION_POST_SCHEMA_MAP = {
    result: result_model_1.resultSchema,
    admit_card: admit_card_model_1.admitCardSchema,
    latest_job: latest_job_model_1.latestJobSchema,
    syllabus: syllabus_model_1.syllabusSchema,
    answer_key: answer_key_model_1.answerKeySchema,
    certificate_verification: certificate_verification_model_1.certificateVerificationSchema,
    important: important_model_1.importantSchema,
    admission: admission_model_1.admissionSchema,
};
