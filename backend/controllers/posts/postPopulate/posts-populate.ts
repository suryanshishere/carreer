import * as crypto from "crypto";
import Admission from "@models/post/sectionModels/admission-model";
import AdmitCard from "@models/post/sectionModels/admit-card-model";
import CertificateVerification from "@models/post/sectionModels/certificate-verification-model";
import Important from "@models/post/sectionModels/important-model";
import LatestJob from "@models/post/sectionModels/latest-job-model";
import Result from "@models/post/sectionModels/result-model";
import Syllabus from "@models/post/sectionModels/syllabus-model";
import AnswerKey from "@models/post/sectionModels/answer-key-model";
import { Model } from "mongoose";
import { latestJobPopulate } from "./postSectionPopulate/latest-job-populate";
import { populateResult } from "./postSectionPopulate/result-populate";
import { admitCardPopulate } from "./postSectionPopulate/admit-card-populate";
import { anwserKeyPopulate } from "./postSectionPopulate/answer-key-populate";
import { syllabusPopulate } from "./postSectionPopulate/syllabus-populate";
import { certificateVerificationPopulate } from "./postSectionPopulate/certificate-verification-populate";
import { importantPopulate } from "./postSectionPopulate/important-populate";
import { admissionPopulate } from "./postSectionPopulate/admission-populate";

// Define the PostModel interface
interface PostModel extends Model<any> {}

// Define the type for models
type Models = {
  [key: string]: PostModel;
};

// Fetch posts function
export const fetchPosts = async (Model: PostModel, limit: number) => {
  return Model.find({})
    .sort({ last_updated: -1 })
    .limit(limit)
    .select("name_of_the_post post_code _id")
    .exec();
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

// Define the type for the populate options
interface PopulateOption {
  path: string;
  select?: string;
}

// Define the type for the populate models object
interface PopulateModels {
  [key: string]: PopulateOption[]; // Keys are categories, values are arrays of PopulateOption
}

export const populateModels: PopulateModels = {
  result: populateResult,
  admit_card: admitCardPopulate,
  latest_job: latestJobPopulate,
  syllabus: syllabusPopulate,
  answer_key: anwserKeyPopulate,
  certificate_verification: certificateVerificationPopulate,
  important: importantPopulate,
  admission: admissionPopulate,
};
