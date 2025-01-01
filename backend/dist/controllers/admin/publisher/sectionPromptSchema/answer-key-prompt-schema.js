"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generative_ai_1 = require("@google/generative-ai");
const answerKeyPromptSchema = {
    description: "Detailed information about downloading the answer key",
    type: generative_ai_1.SchemaType.OBJECT,
    properties: {
        how_to_download_answer_key: {
            type: generative_ai_1.SchemaType.STRING,
            description: "Step-by-step instructions to download the answer key",
        },
    },
    required: ["how_to_download_answer_key"],
};
exports.default = answerKeyPromptSchema;
