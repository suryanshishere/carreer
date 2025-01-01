"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generative_ai_1 = require("@google/generative-ai");
const admitCardPromptSchema = {
    description: "Detailed information about the admit card and download instructions",
    type: generative_ai_1.SchemaType.OBJECT,
    properties: {
        how_to_download_admit_card: {
            type: generative_ai_1.SchemaType.STRING,
            description: "Step-by-step instructions to download the admit card",
        },
    },
    required: ["how_to_download_admit_card"],
};
exports.default = admitCardPromptSchema;
