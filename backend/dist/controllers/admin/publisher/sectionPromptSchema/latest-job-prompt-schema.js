"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generative_ai_1 = require("@google/generative-ai");
const latestJobPromptSchema = {
    description: "Detailed post information for the latest job",
    type: generative_ai_1.SchemaType.OBJECT,
    properties: {
        how_to_fill_the_form: {
            type: generative_ai_1.SchemaType.OBJECT,
            description: "Detailed steps for filling out the job application form",
            properties: {
                registration: {
                    type: generative_ai_1.SchemaType.STRING,
                    description: "Step-by-step instructions for registering for the post",
                },
                apply: {
                    type: generative_ai_1.SchemaType.STRING,
                    description: "Step-by-step instructions for applying to the post after registration",
                },
            },
            required: ["registration", "apply"],
        },
    },
    required: ["how_to_fill_the_form"],
};
exports.default = latestJobPromptSchema;
