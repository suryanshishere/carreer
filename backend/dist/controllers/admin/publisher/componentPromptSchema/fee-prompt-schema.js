"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generative_ai_1 = require("@google/generative-ai");
const feePromptSchema = {
    description: "Schema representing fee details for various categories and genders in Indian rupees.",
    type: generative_ai_1.SchemaType.OBJECT,
    properties: {
        category_wise: {
            type: generative_ai_1.SchemaType.OBJECT,
            description: "Fee details for male candidates across various categories.",
            properties: {
                general: {
                    type: generative_ai_1.SchemaType.NUMBER,
                },
                obc: {
                    type: generative_ai_1.SchemaType.NUMBER,
                },
                ews: {
                    type: generative_ai_1.SchemaType.NUMBER,
                },
                sc: {
                    type: generative_ai_1.SchemaType.NUMBER,
                },
                st: {
                    type: generative_ai_1.SchemaType.NUMBER,
                },
                ph_dviyang: {
                    type: generative_ai_1.SchemaType.NUMBER,
                },
            },
            required: ["general", "obc", "ews", "sc", "st", "ph_dviyang"],
        },
        female: {
            type: generative_ai_1.SchemaType.NUMBER,
            description: "Fee for female candidates.",
        },
        male: {
            type: generative_ai_1.SchemaType.NUMBER,
            description: "Fee for male candidates (display the general category fee here).",
        },
        additional_resources: {
            type: generative_ai_1.SchemaType.STRING,
            description: "Additional information about fee details for other categories and payment modes.",
        },
    },
    required: ["category_wise"],
};
exports.default = feePromptSchema;
