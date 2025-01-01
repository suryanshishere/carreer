"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMPONENT_POST_MODAL_MAP = exports.SECTION_POST_MODAL_MAP = exports.MODAL_MAP = void 0;
const env_data_1 = require("@shared/env-data");
const lodash_1 = require("lodash");
const certificate_verification_model_1 = __importDefault(require("@models/post/sectionModels/certificate-verification-model"));
const date_model_1 = __importDefault(require("@models/post/componentModels/date-model"));
const link_model_1 = __importDefault(require("@models/post/componentModels/link-model"));
const common_model_1 = __importDefault(require("@models/post/componentModels/common-model"));
const fee_model_1 = __importDefault(require("@models/post/componentModels/fee-model"));
const admission_model_1 = __importDefault(require("@models/post/sectionModels/admission-model"));
const important_model_1 = __importDefault(require("@models/post/sectionModels/important-model"));
const answer_key_model_1 = __importDefault(require("@models/post/sectionModels/answer-key-model"));
const syllabus_model_1 = __importDefault(require("@models/post/sectionModels/syllabus-model"));
const latest_job_model_1 = __importDefault(require("@models/post/sectionModels/latest-job-model"));
const admit_card_model_1 = __importDefault(require("@models/post/sectionModels/admit-card-model"));
const result_model_1 = __importDefault(require("@models/post/sectionModels/result-model"));
const OVERALL_MODELS = {
    CertificateVerificationModel: certificate_verification_model_1.default,
    DateModel: date_model_1.default,
    LinkModel: link_model_1.default,
    CommonModel: common_model_1.default,
    FeeModel: fee_model_1.default,
    AdmissionModel: admission_model_1.default,
    ImportantModel: important_model_1.default,
    AnswerKeyModel: answer_key_model_1.default,
    SyllabusModel: syllabus_model_1.default,
    LatestJobModel: latest_job_model_1.default,
    AdmitCardModel: admit_card_model_1.default,
    ResultModel: result_model_1.default,
};
exports.MODAL_MAP = env_data_1.POST_ENV_DATA.OVERALL.reduce((acc, key) => {
    const modelName = `${(0, lodash_1.upperFirst)((0, lodash_1.camelCase)(key))}Model`; // Convert key to PascalCase and append "Model"
    const model = OVERALL_MODELS[modelName]; // Lookup the model in availableModels
    if (model) {
        acc[key] = model;
    }
    else {
        console.warn(`Model "${modelName}" not found for key "${key}".`);
    }
    return acc;
}, {});
// ---------------------------------------------------------
const SECTION_POST_MODAL_MAP = env_data_1.POST_ENV_DATA.SECTIONS.reduce((acc, key) => {
    acc[key] = exports.MODAL_MAP[key];
    return acc;
}, {});
exports.SECTION_POST_MODAL_MAP = SECTION_POST_MODAL_MAP;
// ----------------------------------------------------------
const COMPONENT_POST_MODAL_MAP = env_data_1.POST_ENV_DATA.COMPONENTS.reduce((acc, key) => {
    acc[key] = exports.MODAL_MAP[key];
    return acc;
}, {});
exports.COMPONENT_POST_MODAL_MAP = COMPONENT_POST_MODAL_MAP;
