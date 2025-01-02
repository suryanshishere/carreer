"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonSchema = void 0;
const env_data_1 = require("../../../shared/env-data");
const mongoose_1 = __importStar(require("mongoose"));
const ageCriteriaSchema = new mongoose_1.Schema({
    minimum_age: { type: Number },
    maximum_age: { type: Number },
    age_relaxation: { type: String },
});
const categoryVacancySchema = new mongoose_1.Schema({
    general: { type: Number },
    obc: { type: Number },
    ews: { type: Number },
    sc: { type: Number },
    st: { type: Number },
    ph_dviyang: { type: Number },
});
const VacancyDetailSchema = new mongoose_1.Schema({
    post_name: { type: String, required: true },
    total_post: { type: Number, required: true },
    post_eligibility: { type: String, required: true },
});
const ApplicantsSchema = new mongoose_1.Schema({
    number_of_applicants_each_year: { type: Number },
    number_of_applicants_selected: { type: Number },
});
const { short_information, highlighted_information, department, stage_level } = env_data_1.COMMON_COMPONENT_POST_CHAR_LIMITS;
exports.commonSchema = new mongoose_1.Schema({
    created_by: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    contributors: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    approved: { type: Boolean, default: false, required: true },
    short_information: {
        type: String,
        minlength: short_information.min,
        maxlength: short_information.max,
    },
    highlighted_information: {
        type: String,
        minlength: highlighted_information.min,
        maxlength: highlighted_information.max,
    },
    department: {
        type: String,
        minlength: department.min,
        maxlength: department.max,
    },
    stage_level: {
        type: String,
        minlength: stage_level.min,
        maxlength: stage_level.max,
    },
    applicants: ApplicantsSchema,
    post_importance: { type: String },
    post_exam_toughness_ranking: { type: Number },
    job_type: { type: String },
    post_exam_duration: { type: Number },
    age_criteria: ageCriteriaSchema,
    vacancy: {
        detail: [VacancyDetailSchema],
        category_wise: categoryVacancySchema,
        additional_resources: { type: String },
    },
    eligibility: {
        minimum_qualification: { type: String },
        other_qualification: { type: String },
    },
    post_exam_mode: {
        type: String,
        enum: ["online", "offline_paper_based", "offline_computer_based"],
    },
    applicants_gender_that_can_apply: {
        type: String,
        enum: ["male", "female", "other", "all"],
    },
}, { timestamps: true });
// Export the model
const CommonModel = mongoose_1.default.model("Common", exports.commonSchema);
exports.default = CommonModel;
