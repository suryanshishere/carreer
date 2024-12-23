import {
  latestJobListPopulate,
  latestJobPopulate,
} from "./postSectionPopulate/latest-job-populate";
import {
  populateResult,
  resultListPopulate,
} from "./postSectionPopulate/result-populate";
import {
  admitCardListPopulate,
  admitCardPopulate,
} from "./postSectionPopulate/admit-card-populate";
import {
  answerKeyListPopulate,
  answerKeyPopulate,
} from "./postSectionPopulate/answer-key-populate";
import {
  syllabusListPopulate,
  syllabusPopulate,
} from "./postSectionPopulate/syllabus-populate";
import {
  certificateVerificationListPopulate,
  certificateVerificationPopulate,
} from "./postSectionPopulate/certificate-verification-populate";
import {
  importantListPopulate,
  importantPopulate,
} from "./postSectionPopulate/important-populate";
import {
  admissionListPopulate,
  admissionPopulate,
} from "./postSectionPopulate/admission-populate";

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
