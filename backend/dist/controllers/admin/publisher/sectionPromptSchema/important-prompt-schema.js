"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generative_ai_1 = require("@google/generative-ai");
const importantPromptSchema = {
    description: "Detailed post information",
    type: generative_ai_1.SchemaType.OBJECT,
    properties: {
        how_to_fill_the_form: {
            type: generative_ai_1.SchemaType.STRING,
            description: "Step-by-step instructions for filling out the form",
        },
    },
    required: ["how_to_fill_the_form"],
};
exports.default = importantPromptSchema;
