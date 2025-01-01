"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postIdGeneration = exports.postCreation = exports.SECTION_DESCRIPTIONS = exports.COMPONENT_POST_PROMPT_SCHEMA_MAP = exports.SECTION_POST_PROMPT_SCHEMA_MAP = void 0;
const result_prompt_schema_1 = __importDefault(require("./sectionPromptSchema/result-prompt-schema"));
const admit_card_prompt_schema_1 = __importDefault(require("./sectionPromptSchema/admit-card-prompt-schema"));
const latest_job_prompt_schema_1 = __importDefault(require("./sectionPromptSchema/latest-job-prompt-schema"));
const syllabus_prompt_schema_1 = __importDefault(require("./sectionPromptSchema/syllabus-prompt-schema"));
const answer_key_prompt_schema_1 = __importDefault(require("./sectionPromptSchema/answer-key-prompt-schema"));
const certificate_verificate_prompt_schema_1 = __importDefault(require("./sectionPromptSchema/certificate-verificate-prompt-schema"));
const important_prompt_schema_1 = __importDefault(require("./sectionPromptSchema/important-prompt-schema"));
const admission_prompt_schema_1 = __importDefault(require("./sectionPromptSchema/admission-prompt-schema"));
const fee_prompt_schema_1 = __importDefault(require("./componentPromptSchema/fee-prompt-schema"));
const date_prompt_schema_1 = __importDefault(require("./componentPromptSchema/date-prompt-schema"));
const link_prompt_schema_1 = __importDefault(require("./componentPromptSchema/link-prompt-schema"));
const common_prompt_schema_1 = __importDefault(require("./componentPromptSchema/common-prompt-schema"));
const generative_ai_1 = require("@google/generative-ai");
const crypto_1 = __importDefault(require("crypto"));
exports.SECTION_POST_PROMPT_SCHEMA_MAP = {
    result: result_prompt_schema_1.default,
    admit_card: admit_card_prompt_schema_1.default,
    latest_job: latest_job_prompt_schema_1.default,
    syllabus: syllabus_prompt_schema_1.default,
    answer_key: answer_key_prompt_schema_1.default,
    certificate_verification: certificate_verificate_prompt_schema_1.default,
    important: important_prompt_schema_1.default,
    admission: admission_prompt_schema_1.default,
};
exports.COMPONENT_POST_PROMPT_SCHEMA_MAP = {
    fee: fee_prompt_schema_1.default,
    date: date_prompt_schema_1.default,
    link: link_prompt_schema_1.default,
    common: common_prompt_schema_1.default,
};
exports.SECTION_DESCRIPTIONS = {
    result: "An engaging title for the post related to exam results, clearly conveying the purpose and outcome of the section.",
    admit_card: "A descriptive and attention-grabbing name for the post, highlighting essential admit card information for candidates.",
    latest_job: "An informative and compelling post title about job opportunities, designed to attract attention for job seekers.",
    answer_key: "A descriptive title for the post, focusing on providing clear and precise information about the answer key for the exam.",
    syllabus: "An engaging and detailed post name that provides essential syllabus details and exam preparation guidance.",
    certificate_verification: "A clear and concise post title, aimed at informing about certificate verification requirements or updates.",
    admission: "An engaging and well-crafted title for the post, centered on admission-related updates and guidance.",
    important: "An impactful title for the post, emphasizing critical and urgent information about the relevant section.",
};
const postCreation = (nameOfThePost, schema) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the schema argument to ensure it's a valid object
        if (Object.keys(schema).length === 0) {
            console.error("Schema cannot be empty");
            return null; // Return null for controlled error handling
        }
        // Initialize Google Generative AI with the provided API key
        if (!process.env.GEMINI_API_KEY) {
            console.error("Missing GEMINI API Key");
            return null; // Return null for controlled error handling
        }
        const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        // Generate the content for the post
        const prompt = `Generate a comprehensive and engaging post for the "${nameOfThePost}"`;
        const result = yield model.generateContent(prompt);
        // Ensure the result is in the correct format (JSON)
        const generatedContent = result.response.text();
        const parsedContent = parseGeneratedContent(generatedContent);
        return parsedContent; // Successfully parsed content
    }
    catch (error) {
        console.error("Post Creation Error:", error);
        return null; // Return null to signal an error occurred
    }
});
exports.postCreation = postCreation;
// Helper function to parse the generated content
const parseGeneratedContent = (content) => {
    try {
        const parsedContent = JSON.parse(content);
        return parsedContent;
    }
    catch (syntaxError) {
        console.error("JSON Syntax Error in generated content:", syntaxError);
        console.error("Generated content:", content);
        return null;
    }
};
const postIdGeneration = (postCode) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = crypto_1.default.createHash("sha256");
    hash.update(postCode);
    const uniqueId = hash.digest("hex");
    return uniqueId.slice(0, 24);
});
exports.postIdGeneration = postIdGeneration;
