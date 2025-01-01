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
exports.requestSchema = void 0;
const env_data_1 = require("src/shared/env-data");
const mongoose_1 = __importStar(require("mongoose"));
const { MIN_REASON_LENGTH, MAX_REASON_LENGTH } = env_data_1.CONTACT_US_ENV_DATA;
exports.requestSchema = new mongoose_1.Schema({
    //_id will be userid
    status: {
        type: String,
        default: "pending",
        enum: env_data_1.ADMIN_DATA.STATUS,
        required: true,
        index: true,
    },
    role_applied: {
        type: String,
        //if want to be both admin and publisher, then add "admin" with both as admin_status in enum
        enum: env_data_1.ADMIN_DATA.ROLE_APPLIED,
        required: true,
        index: true,
    },
    reason: {
        type: String,
        required: true,
        min: MIN_REASON_LENGTH,
        max: MAX_REASON_LENGTH,
    },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    //only set expireAt when role_applied matches the rejected done so.
    expireAt: { type: Date, expires: env_data_1.ADMIN_DATA.REQUEST_DOC_EXPIRY * 60 * 60 }, // TTL index set to expire in hours
}, { timestamps: true });
const RequestModal = mongoose_1.default.model("Request", exports.requestSchema);
exports.default = RequestModal;
