"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generative_ai_1 = require("@google/generative-ai");
const resultPromptSchema = {
    description: "Schema representing detailed information about the result, including instructions, categories, and cutoffs.",
    type: generative_ai_1.SchemaType.OBJECT,
    properties: {
        how_to_download_result: {
            type: generative_ai_1.SchemaType.STRING,
            description: "Step-by-step instructions to download the result.",
        },
        result: {
            type: generative_ai_1.SchemaType.OBJECT,
            description: "Result details including cutoff marks for different categories.",
            properties: {
                additional_resources: {
                    type: generative_ai_1.SchemaType.STRING,
                    description: "Additional information about the result or total marks and cutoff. Do not provide any links.",
                },
                general: {
                    type: generative_ai_1.SchemaType.NUMBER,
                    description: "Cutoff marks for the General category.",
                },
                obc: {
                    type: generative_ai_1.SchemaType.NUMBER,
                    description: "Cutoff marks for the OBC category.",
                },
                ews: {
                    type: generative_ai_1.SchemaType.NUMBER,
                    description: "Cutoff marks for the EWS category.",
                },
                sc: {
                    type: generative_ai_1.SchemaType.NUMBER,
                    description: "Cutoff marks for the SC category.",
                },
                st: {
                    type: generative_ai_1.SchemaType.NUMBER,
                    description: "Cutoff marks for the ST category.",
                },
                ph_dviyang: {
                    type: generative_ai_1.SchemaType.NUMBER,
                    description: "Cutoff marks for the PH (Divyang) category.",
                },
            },
            required: [
                "additional_resources",
                "general",
                "obc",
                "ews",
                "sc",
                "st",
                "ph_dviyang",
            ],
        },
    },
    required: ["how_to_download_result", "result"],
};
exports.default = resultPromptSchema;
// description:
//     "Schema representing detailed information about the result, including instructions, categories, and cutoffs.",
//   type: "object",
//   properties: {
//     how_to_download_result: {
//       type: "string",
//       description: "Step-by-step instructions to download the result.",
//     },
//     result: {
//       type: "object",
//       description:
//         "Result details including cutoff marks for different categories.",
//       properties: {
//         additional_resources: {
//           type: "string",
//           description:
//             "Additional information about the result or total marks and cutoff. Do not provide any links.",
//         },
//         general: {
//           type: "number",
//           description: "Cutoff marks for the General category.",
//         },
//         obc: {
//           type: "number",
//           description: "Cutoff marks for the OBC category.",
//         },
//         ews: {
//           type: "number",
//           description: "Cutoff marks for the EWS category.",
//         },
//         sc: {
//           type: "number",
//           description: "Cutoff marks for the SC category.",
//         },
//         st: {
//           type: "number",
//           description: "Cutoff marks for the ST category.",
//         },
//         ph_dviyang: {
//           type: "number",
//           description: "Cutoff marks for the PH (Divyang) category.",
//         },
//       },
//       required: [
//         "additional_resources",
//         "general",
//         "obc",
//         "ews",
//         "sc",
//         "st",
//         "ph_dviyang",
//       ],
//       additionalProperties: false,
//     },
//   },
//   required: ["how_to_download_result", "result"],
//   additionalProperties: false,
