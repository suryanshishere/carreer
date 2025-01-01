"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinksSchema = void 0;
const mongoose_1 = require("mongoose");
const AdditionalResourcesSchema = new mongoose_1.Schema({
    faq: { type: String },
    contact_us: { type: String },
    // important_dates: { type: String },
});
exports.LinksSchema = new mongoose_1.Schema({
    created_by: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    contributors: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    approved: { type: Boolean, default: false, required: true },
    official_website: { type: String },
    apply_online: { type: String },
    register_now: { type: String },
    download_sample_papers: { type: String },
    get_admit_card: { type: String },
    view_results: { type: String },
    check_answer_key: { type: String },
    counseling_portal: { type: String },
    verify_certificates: { type: String },
    additional_resources: { type: AdditionalResourcesSchema },
}, { timestamps: true });
const LinkModel = (0, mongoose_1.model)("Link", exports.LinksSchema);
exports.default = LinkModel;
