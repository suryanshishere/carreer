"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const env_data_1 = require("../../shared/env-data");
const postSectionsArray = env_data_1.POST_ENV_DATA.SECTIONS;
const sectionFields = postSectionsArray.reduce((fields, section) => {
    fields[section] = {
        exist: { type: Boolean, default: false },
        approved: {
            type: Boolean,
            default: false,
            validate: {
                validator: function (value) {
                    return !value || this.exist;
                },
                message: (props) => `'approved' can only be true if 'exist' is true.`,
            },
        },
    };
    return fields;
}, {});
const createdByFields = postSectionsArray.reduce((fields, section) => {
    fields[section] = {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    };
    return fields;
}, {});
const { MIN_POST_CODE, MAX_POST_CODE, ALPHA_NUM_UNDERSCORE } = env_data_1.POST_ENV_DATA;
const postSchema = new mongoose_1.Schema({
    post_code: {
        type: String,
        unique: true,
        required: true,
        minlength: [
            MIN_POST_CODE,
            `Post code must be at least ${MIN_POST_CODE} characters long.`,
        ],
        maxlength: [
            MAX_POST_CODE,
            `Post code must be at max ${MAX_POST_CODE} characters long.`,
        ],
        validate: {
            validator: function (value) {
                return ALPHA_NUM_UNDERSCORE.test(value);
            },
            message: "Post code can only contain letters, numbers, and underscores, with no spaces.",
        },
    },
    sections: {
        type: new mongoose_1.Schema(sectionFields, { _id: false }),
    },
    created_by: {
        type: new mongoose_1.Schema(createdByFields, { _id: false }),
    },
});
const PostModel = mongoose_1.default.model("Post", postSchema);
exports.default = PostModel;
