"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sectionListPopulate = exports.sectionDetailPopulateModels = void 0;
const postListAndDetailPopulate_1 = require("./postListAndDetailPopulate");
exports.sectionDetailPopulateModels = {
    result: postListAndDetailPopulate_1.populateResult,
    admit_card: postListAndDetailPopulate_1.admitCardPopulate,
    latest_job: postListAndDetailPopulate_1.latestJobPopulate,
    syllabus: postListAndDetailPopulate_1.syllabusPopulate,
    answer_key: postListAndDetailPopulate_1.answerKeyPopulate,
    certificate_verification: postListAndDetailPopulate_1.certificateVerificationPopulate,
    important: postListAndDetailPopulate_1.importantPopulate,
    admission: postListAndDetailPopulate_1.admissionPopulate,
};
exports.sectionListPopulate = {
    result: postListAndDetailPopulate_1.resultListPopulate,
    admit_card: postListAndDetailPopulate_1.admitCardListPopulate,
    latest_job: postListAndDetailPopulate_1.latestJobListPopulate,
    syllabus: postListAndDetailPopulate_1.syllabusListPopulate,
    answer_key: postListAndDetailPopulate_1.answerKeyListPopulate,
    certificate_verification: postListAndDetailPopulate_1.certificateVerificationListPopulate,
    important: postListAndDetailPopulate_1.importantListPopulate,
    admission: postListAndDetailPopulate_1.admissionListPopulate,
};
