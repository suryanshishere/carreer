import CertificateVerificationModel from "@models/post/sectionModels/certificate-verification-model";
import { Model } from "mongoose";
import DateModel from "@models/post/overallModels/date-model";
import LinkModel from "@models/post/overallModels/link-model";
import CommonModel from "@models/post/overallModels/common-model";
import FeeModel from "@models/post/overallModels/fee-model";
import AdmissionModel from "@models/post/sectionModels/admission-model";
import ImportantModel from "@models/post/sectionModels/important-model";
import AnswerKeyModel from "@models/post/sectionModels/answer-key-model";
import SyllabusModel from "@models/post/sectionModels/syllabus-model";
import LatestJobModel from "@models/post/sectionModels/latest-job-model";
import AdmitCardModel from "@models/post/sectionModels/admit-card-model";
import ResultModel from "@models/post/sectionModels/result-model";

interface PostModel extends Model<any> {}

export type IModel = {
  [key: string]: PostModel;
};

export const MODAL_MAP: IModel = {
  result: ResultModel,
  admit_card: AdmitCardModel,
  latest_job: LatestJobModel,
  syllabus: SyllabusModel,
  answer_key: AnswerKeyModel,
  certificate_verification: CertificateVerificationModel,
  important: ImportantModel,
  admission: AdmissionModel,
  date: DateModel,
  link: LinkModel,
  common: CommonModel,
  fee: FeeModel,
};
export const SECTION_POST_MODAL_MAP: IModel = {
  result: ResultModel,
  admit_card: AdmitCardModel,
  latest_job: LatestJobModel,
  syllabus: SyllabusModel,
  answer_key: AnswerKeyModel,
  certificate_verification: CertificateVerificationModel,
  important: ImportantModel,
  admission: AdmissionModel,
};
export const OVERALL_POST_MODAL_MAP: IModel = {
  date: DateModel,
  link: LinkModel,
  common: CommonModel,
  fee: FeeModel,
};
