"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generative_ai_1 = require("@google/generative-ai");
const linkPromptSchema = {
    description: "Schema representing detailed information about a post, including metadata and valid links for official resources.",
    type: generative_ai_1.SchemaType.OBJECT,
    properties: {
        official_website: {
            type: generative_ai_1.SchemaType.STRING,
            description: "Official website link of the post or organization. ",
        },
        apply_online: {
            type: generative_ai_1.SchemaType.STRING,
            description: "Link to the online application form. ",
        },
        register_now: {
            type: generative_ai_1.SchemaType.STRING,
            description: "Link for registration. ",
        },
        download_sample_papers: {
            type: generative_ai_1.SchemaType.STRING,
            description: "Link to download sample papers for preparation. ",
        },
        get_admit_card: {
            type: generative_ai_1.SchemaType.STRING,
            description: "Link to download the admit card. ",
        },
        view_results: {
            type: generative_ai_1.SchemaType.STRING,
            description: "Link to check results. ",
        },
        check_answer_key: {
            type: generative_ai_1.SchemaType.STRING,
            description: "Real link to view or download the answer key. ",
        },
        counseling_portal: {
            type: generative_ai_1.SchemaType.STRING,
            description: "Real link to access the counseling portal. ",
        },
        verify_certificates: {
            type: generative_ai_1.SchemaType.STRING,
            description: "Real link for verifying certificates. ",
        },
        additional_resources: {
            type: generative_ai_1.SchemaType.OBJECT,
            description: "Additional resources related to the post.",
            properties: {
                faq: {
                    type: generative_ai_1.SchemaType.STRING,
                    description: "Real link to the FAQ section. ",
                },
                contact_us: {
                    type: generative_ai_1.SchemaType.STRING,
                    description: "Real link to the Contact Us page. ",
                },
            },
            required: ["faq", "contact_us"],
        },
    },
};
exports.default = linkPromptSchema;
