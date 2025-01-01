"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generative_ai_1 = require("@google/generative-ai");
const certificateVerificationPromptSchema = {
    description: "Detailed post information for certificate verification process",
    type: generative_ai_1.SchemaType.OBJECT,
    properties: {
        how_to_fill_the_form: {
            type: generative_ai_1.SchemaType.STRING,
            description: "Step-by-step instructions to fill the certificate verification form",
        },
    },
    required: ["how_to_fill_the_form"],
};
exports.default = certificateVerificationPromptSchema;
