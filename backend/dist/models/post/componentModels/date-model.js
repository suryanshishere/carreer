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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const DateRangeSchema = new mongoose_1.default.Schema({
    current_year: { type: Date },
    previous_year: { type: Date, required: true },
});
exports.dateSchema = new mongoose_1.Schema({
    created_by: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    contributors: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    approved: { type: Boolean, default: false, required: true },
    application_start_date: { type: DateRangeSchema },
    application_end_date: { type: DateRangeSchema },
    exam_fee_payment_end_date: { type: DateRangeSchema },
    form_correction_start_date: { type: DateRangeSchema },
    form_correction_end_date: { type: DateRangeSchema },
    exam_date: { type: DateRangeSchema },
    admit_card_release_date: { type: DateRangeSchema },
    exam_city_details_release_date: { type: DateRangeSchema },
    answer_key_release_date: { type: DateRangeSchema },
    result_announcement_date: { type: DateRangeSchema },
    counseling_start_date: { type: DateRangeSchema },
    counseling_end_date: { type: DateRangeSchema },
    counseling_result_announcement_date: { type: DateRangeSchema },
    additional_resources: { type: String },
}, { timestamps: true });
const DateModel = mongoose_1.default.model("Date", exports.dateSchema);
exports.default = DateModel;
