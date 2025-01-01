"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generative_ai_1 = require("@google/generative-ai");
const syllabusPromptSchema = {
    description: "Detailed syllabus categorized by sections and topics",
    type: generative_ai_1.SchemaType.OBJECT,
    properties: {
        syllabus: {
            description: "An array of sections with their respective topics",
            type: generative_ai_1.SchemaType.ARRAY,
            items: {
                type: generative_ai_1.SchemaType.OBJECT,
                properties: {
                    section: {
                        type: generative_ai_1.SchemaType.STRING,
                        description: "The name of the syllabus section (e.g., Mathematics, Programming)",
                    },
                    topics: {
                        type: generative_ai_1.SchemaType.STRING,
                        description: "Comma-separated topics covered under this section",
                    },
                },
                required: ["section", "topics"],
            },
        },
    },
    required: ["syllabus"],
};
exports.default = syllabusPromptSchema;
