import Admission from "@models/post/sectionModels/admission-model";
import AdmitCard from "@models/post/sectionModels/admit-card-model";
import CertificateVerification from "@models/post/sectionModels/certificate-verification-model";
import Important from "@models/post/sectionModels/important-model";
import LatestJob from "@models/post/sectionModels/latest-job-model";
import Result from "@models/post/sectionModels/result-model";
import Syllabus from "@models/post/sectionModels/syllabus-model";
import AnswerKey from "@models/post/sectionModels/answer-key-model";
import { Model } from "mongoose";
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

interface PostModel extends Model<any> {}

export type Models = {
  [key: string]: PostModel;
};



export const MODEL_DATA: Models = {
  result: Result,
  admit_card: AdmitCard,
  latest_job: LatestJob,
  syllabus: Syllabus,
  answer_key: AnswerKey,
  certificate_verification: CertificateVerification,
  important: Important,
  admission: Admission,
};

interface PopulateOption {
  path: string;
  select?: string;
}

interface sectionDetailPopulateModels {
  [key: string]: PopulateOption[];
}

export const sectionDetailPopulateModels: sectionDetailPopulateModels = {
  result: populateResult,
  admit_card: admitCardPopulate,
  latest_job: latestJobPopulate,
  syllabus: syllabusPopulate,
  answer_key: answerKeyPopulate,
  certificate_verification: certificateVerificationPopulate,
  important: importantPopulate,
  admission: admissionPopulate,
};

export const sectionListPopulate: sectionDetailPopulateModels = {
  result: resultListPopulate,
  admit_card: admitCardListPopulate,
  latest_job: latestJobListPopulate,
  syllabus: syllabusListPopulate,
  answer_key: answerKeyListPopulate,
  certificate_verification: certificateVerificationListPopulate,
  important: importantListPopulate,
  admission: admissionListPopulate,
};