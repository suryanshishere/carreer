"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generative_ai_1 = require("@google/generative-ai");
const env_data_1 = require("@shared/env-data");
const { short_information, highlighted_information, department, stage_level } = env_data_1.COMMON_COMPONENT_POST_CHAR_LIMITS;
const ageCriteria = {
    minimum_age: { type: generative_ai_1.SchemaType.NUMBER },
    maximum_age: { type: generative_ai_1.SchemaType.NUMBER },
    age_relaxation: { type: generative_ai_1.SchemaType.STRING },
};
const commonPromptSchema = {
    description: "Schema describing common information fields related to a post, including eligibility, vacancy details, age criteria, and other related metadata.",
    type: generative_ai_1.SchemaType.OBJECT,
    properties: {
        short_information: {
            type: generative_ai_1.SchemaType.STRING,
            description: `A concise description of the post, within ${short_information.min}-${short_information.max} characters.`,
        },
        highlighted_information: {
            type: generative_ai_1.SchemaType.STRING,
            description: `Key details about the post, within ${highlighted_information.min}-${highlighted_information.max} characters.`,
        },
        department: {
            type: generative_ai_1.SchemaType.STRING,
            description: `The department or organization offering the post, within ${department.min}-${department.max} characters.`,
        },
        stage_level: {
            type: generative_ai_1.SchemaType.STRING,
            description: `The level or stage of the post, within ${stage_level.min}-${stage_level.max} characters.`,
        },
        applicants: {
            description: "Information about applicants who applied and got selected for the post.",
            type: generative_ai_1.SchemaType.OBJECT,
            properties: {
                number_of_applicants_each_year: {
                    type: generative_ai_1.SchemaType.NUMBER,
                    description: "The number of applicants who applied each year.",
                },
                number_of_applicants_selected: {
                    type: generative_ai_1.SchemaType.NUMBER,
                    description: "The number of applicants who were selected.",
                },
            },
        },
        post_importance: {
            type: generative_ai_1.SchemaType.STRING,
            description: "The significance or importance of the post.",
        },
        job_type: {
            type: generative_ai_1.SchemaType.STRING,
            description: "The type or category of the job.",
        },
        post_exam_duration: {
            type: generative_ai_1.SchemaType.NUMBER,
            description: "The duration of the examination for the post, in minutes.",
        },
        age_criteria: {
            description: "Details about the age requirements for the post.",
            type: generative_ai_1.SchemaType.OBJECT,
            properties: ageCriteria,
        },
        vacancy: {
            description: "Information about the number and distribution of vacancies for the post.",
            type: generative_ai_1.SchemaType.OBJECT,
            properties: {
                detail: {
                    description: "Detailed vacancy information, including post name, total vacancies, and eligibility.",
                    type: generative_ai_1.SchemaType.ARRAY,
                    items: {
                        type: generative_ai_1.SchemaType.OBJECT,
                        properties: {
                            post_name: {
                                type: generative_ai_1.SchemaType.STRING,
                                description: "The name of the post.",
                            },
                            total_post: {
                                type: generative_ai_1.SchemaType.NUMBER,
                                description: "The total number of posts available.",
                            },
                            post_eligibility: {
                                type: generative_ai_1.SchemaType.STRING,
                                description: "Eligibility criteria for the post.",
                            },
                        },
                        required: ["post_name", "total_post", "post_eligibility"],
                    },
                },
                category_wise: {
                    description: "Category-wise distribution of vacancies.",
                    type: generative_ai_1.SchemaType.OBJECT,
                    properties: {
                        general: {
                            type: generative_ai_1.SchemaType.NUMBER,
                            description: "Vacancies for the General category.",
                        },
                        obc: {
                            type: generative_ai_1.SchemaType.NUMBER,
                            description: "Vacancies for the OBC category.",
                        },
                        ews: {
                            type: generative_ai_1.SchemaType.NUMBER,
                            description: "Vacancies for the EWS category.",
                        },
                        sc: {
                            type: generative_ai_1.SchemaType.NUMBER,
                            description: "Vacancies for the SC category.",
                        },
                        st: {
                            type: generative_ai_1.SchemaType.NUMBER,
                            description: "Vacancies for the ST category.",
                        },
                        ph_dviyang: {
                            type: generative_ai_1.SchemaType.NUMBER,
                            description: "Vacancies for Physically Handicapped (Divyang) category.",
                        },
                    },
                },
            },
        },
        eligibility: {
            type: generative_ai_1.SchemaType.OBJECT,
            description: "Details about the eligibility criteria for the post.",
            properties: {
                minimum_qualification: {
                    type: generative_ai_1.SchemaType.STRING,
                    description: "The minimum required qualification for the post.",
                },
                additional_qualification: {
                    type: generative_ai_1.SchemaType.STRING,
                    description: "Any additional qualifications required for the post.",
                },
            },
        },
        post_exam_mode: {
            type: generative_ai_1.SchemaType.STRING,
            description: "The mode of the examination for the post.",
            enum: ["online", "offline_paper_based", "offline_computer_based"],
        },
        applicants_gender_that_can_apply: {
            type: generative_ai_1.SchemaType.STRING,
            description: "The gender(s) eligible to apply for the post.",
            enum: ["male", "female", "other", "all"],
        },
    },
    required: [
        "short_information",
        "highlighted_information",
        "department",
        "job_type",
        "age_criteria",
        "vacancy",
        "eligibility",
        "post_exam_mode",
        "applicants_gender_that_can_apply",
    ],
};
exports.default = commonPromptSchema;
