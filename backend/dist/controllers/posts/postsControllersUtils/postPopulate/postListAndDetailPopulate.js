"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.admissionListPopulate = exports.admissionPopulate = exports.admitCardListPopulate = exports.admitCardPopulate = exports.answerKeyListPopulate = exports.answerKeyPopulate = exports.certificateVerificationListPopulate = exports.certificateVerificationPopulate = exports.importantListPopulate = exports.importantPopulate = exports.latestJobListPopulate = exports.latestJobPopulate = exports.resultListPopulate = exports.populateResult = exports.syllabusListPopulate = exports.syllabusPopulate = void 0;
// Syllabus related populate configurations
exports.syllabusPopulate = [
    { path: "important_dates", select: "additional_resources" },
    { path: "important_links", select: "official_website" },
    { path: "common", select: "-approved" },
    { path: "post", select: "post_code" },
];
exports.syllabusListPopulate = [
    {
        path: "important_dates",
        select: "application_start_date additional_resources",
    },
    { path: "important_links", select: "official_website" },
    { path: "post", select: "post_code" },
];
// Result related populate configurations
exports.populateResult = [
    {
        path: "important_links",
        select: "view_results official_website additional_resources",
    },
    {
        path: "common",
        select: "-post_exam_duration -age_criteria -eligibility -approved -__v",
    },
    {
        path: "important_dates",
        select: "result_announcement_date additional_resources counseling_result_announcement_date counseling_end_date counseling_start_date",
    },
    { path: "post", select: "post_code" },
];
exports.resultListPopulate = [
    {
        path: "important_links",
        select: "view_results official_website",
    },
    {
        path: "important_dates",
        select: "result_announcement_date",
    },
    { path: "post", select: "post_code" },
];
// Latest Job related populate configurations
exports.latestJobPopulate = [
    {
        path: "important_links",
        select: "apply_online register_now official_website download_sample_papers additional_resources",
    },
    { path: "important_dates", select: "-approved" },
    { path: "application_fee", select: "-approved" },
    { path: "common", select: "-approved" },
    { path: "post", select: "post_code" },
];
exports.latestJobListPopulate = [
    {
        path: "important_links",
        select: "apply_online register_now official_website",
    },
    {
        path: "important_dates",
        select: "application_start_date application_end_date exam_date",
    },
    { path: "post", select: "post_code" },
];
// Important data related populate configurations
exports.importantPopulate = [
    { path: "common", select: "short_information department stage_level" },
    { path: "important_dates", select: "additional_resources" },
    { path: "important_links", select: "official_website additional_resources" },
    { path: "post", select: "post_code" },
];
exports.importantListPopulate = [
    { path: "important_dates", select: "additional_resources" },
    { path: "important_links", select: "official_website additional_resources" },
    { path: "post", select: "post_code" },
];
// Certificate Verification related populate configurations
exports.certificateVerificationPopulate = [
    {
        path: "important_links",
        select: "get_admit_card check_answer_key view_results official_website additional_resources",
    },
    { path: "important_dates", select: "additional_resources" },
    { path: "common", select: "short_information department eligibility" },
    { path: "post", select: "post_code" },
];
exports.certificateVerificationListPopulate = [
    {
        path: "important_links",
        select: "official_website additional_resources",
    },
    { path: "important_dates", select: "certificate_verification_date" },
    { path: "post", select: "post_code" },
];
// Answer Key related populate configurations
exports.answerKeyPopulate = [
    { path: "common", select: "-eligibility -approved" },
    {
        path: "important_dates",
        select: "answer_key_release_date result_announcement_date counseling_start_date counseling_end_date counseling_result_announcement_date",
    },
    {
        path: "important_links",
        select: "official_website check_answer_key get_admit_card",
    },
    { path: "syllabus", select: "syllabus" },
    { path: "post", select: "post_code" },
];
exports.answerKeyListPopulate = [
    {
        path: "important_dates",
        select: "answer_key_release_date result_announcement_date",
    },
    {
        path: "important_links",
        select: "official_website check_answer_key get_admit_card",
    },
    { path: "post", select: "post_code" },
];
// Admit Card related populate configurations
exports.admitCardPopulate = [
    {
        path: "important_dates",
        select: "result_announcement_date admit_card_release_date answer_key_release_date exam_date",
    },
    {
        path: "important_links",
        select: "official_website get_admit_card download_sample_papers additional_resources",
    },
    { path: "common", select: "-eligibility -approved" },
    { path: "syllabus", select: "syllabus" },
    { path: "post", select: "post_code" },
];
exports.admitCardListPopulate = [
    {
        path: "important_dates",
        select: "admit_card_release_date exam_date",
    },
    {
        path: "important_links",
        select: "official_website get_admit_card download_sample_papers",
    },
    { path: "post", select: "post_code" },
];
// Admission related populate configurations
exports.admissionPopulate = [
    {
        path: "common",
        select: "-post_exam_duration -post_exam_toughness_ranking -approved",
    },
    {
        path: "important_dates",
        select: "counseling_start_date counseling_end_date counseling_result_announcement_date additional_resources",
    },
    {
        path: "important_links",
        select: "get_admit_card additional_resources view_results counseling_portal verify_certificates",
    },
    { path: "post", select: "post_code" },
];
exports.admissionListPopulate = [
    {
        path: "important_dates",
        select: "counseling_start_date counseling_end_date counseling_result_announcement_date",
    },
    {
        path: "important_links",
        select: "view_results counseling_portal",
    },
    { path: "post", select: "post_code" },
];
