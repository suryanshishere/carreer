"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSchema = exports.linkRequiredMap = exports.dateRequiredMap = void 0;
const postSortMap = {
    result: "result_announcement_date",
    latest_job: "application_start_date",
    answer_key: "answer_key_release_date",
    syllabus: "application_start_date",
    certificate_verification: "certificate_verification_date",
    admission: "counseling_start_date",
    important: "important_date",
    admit_card: "admit_card_release_date",
};
exports.default = postSortMap;
exports.dateRequiredMap = {
    result: [
        "result_announcement_date",
        "answer_key_release_date",
        "result_announcement_date",
        "counseling_start_date",
        "counseling_end_date",
        "counseling_result_announcement_date",
    ],
    latest_job: ["application_start_date", "application_end_date"],
    answer_key: ["answer_key_release_date"],
    syllabus: ["application_start_date", "application_end_date"],
    certificate_verification: ["certificate_verification_date"],
    admission: [
        "counseling_start_date",
        "counseling_end_date",
        "counseling_result_announcement_date",
    ],
    important: ["important_date"],
    admit_card: ["admit_card_release_date", "exam_date"],
};
exports.linkRequiredMap = {
    result: ["view_results"],
    latest_job: ["apply_online"],
    answer_key: ["check_answer_key"],
    syllabus: ["download_sample_papers"],
    certificate_verification: ["verify_certificates"],
    admission: ["counseling_portal"],
    important: ["faq", "contact_us"],
    admit_card: ["get_admit_card"],
};
const updateSchema = (schema, key, section) => {
    if (key === "date") {
        return Object.assign(Object.assign({}, schema), { required: [
                ...(schema.required || []),
                ...exports.dateRequiredMap[section],
            ] });
    }
    else if (key === "link") {
        return Object.assign(Object.assign({}, schema), { required: [
                ...(schema.required || []),
                ...exports.linkRequiredMap[section],
                "official_website",
            ] });
    }
    return schema;
};
exports.updateSchema = updateSchema;
