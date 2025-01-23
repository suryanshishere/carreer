import {
  latestJobListPopulate,
  latestJobPopulate,
  populateResult,
  resultListPopulate,
  admitCardListPopulate,
  admitCardPopulate,
  answerKeyListPopulate,
  answerKeyPopulate,
  syllabusListPopulate,
  syllabusPopulate,
  certificateVerificationListPopulate,
  certificateVerificationPopulate,
  importantListPopulate,
  importantPopulate,
  admissionListPopulate,
  admissionPopulate,
} from "./postListAndDetailPopulate";

interface PopulateOption {
  path: string;
  select?: string;
}

interface ISectionPopulateModels {
  [key: string]: PopulateOption[];
}

export const sectionDetailPopulateModels: ISectionPopulateModels = {
  result: populateResult,
  admit_card: admitCardPopulate,
  latest_job: latestJobPopulate,
  syllabus: syllabusPopulate,
  answer_key: answerKeyPopulate,
  certificate_verification: certificateVerificationPopulate,
  important: importantPopulate,
  admission: admissionPopulate,
};

export const sectionListPopulate: ISectionPopulateModels = {
  result: resultListPopulate,
  admit_card: admitCardListPopulate,
  latest_job: latestJobListPopulate,
  syllabus: syllabusListPopulate,
  answer_key: answerKeyListPopulate,
  certificate_verification: certificateVerificationListPopulate,
  important: importantListPopulate,
  admission: admissionListPopulate,
};
