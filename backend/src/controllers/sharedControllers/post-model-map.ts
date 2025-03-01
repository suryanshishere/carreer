import { Model } from "mongoose";
import  POST_DB  from "@models/post_models/post_db";
import { camelCase, upperFirst } from "lodash";
import CertificateVerificationModel from "@models/post_models/sectionModels/certificate-verification-model";
import DateModel from "@models/post_models/componentModels/date-model";
import LinkModel from "@models/post_models/componentModels/link-model";
import CommonModel from "@models/post_models/componentModels/common-model";
import FeeModel from "@models/post_models/componentModels/fee-model";
import AdmissionModel from "@models/post_models/sectionModels/admission-model";
import ImportantModel from "@models/post_models/sectionModels/important-model";
import AnswerKeyModel from "@models/post_models/sectionModels/answer-key-model";
import SyllabusModel from "@models/post_models/sectionModels/syllabus-model";
import LatestJobModel from "@models/post_models/sectionModels/latest-job-model";
import AdmitCardModel from "@models/post_models/sectionModels/admit-card-model";
import ResultModel from "@models/post_models/sectionModels/result-model";

interface IOverallModels extends Model<any> {}
const OVERALL_MODELS: Record<string, IOverallModels> = {
  CertificateVerificationModel,
  DateModel,
  LinkModel,
  CommonModel,
  FeeModel,
  AdmissionModel,
  ImportantModel,
  AnswerKeyModel,
  SyllabusModel,
  LatestJobModel,
  AdmitCardModel,
  ResultModel,
};

export const MODAL_MAP: Record<string, IOverallModels> =
  POST_DB.overall.reduce((acc, key) => {
    const modelName = `${upperFirst(camelCase(key))}Model`; // Convert key to PascalCase and append "Model"
    const model = OVERALL_MODELS[modelName]; // Lookup the model in availableModels

    if (model) {
      acc[key] = model;
    } else {
      console.warn(`Model "${modelName}" not found for key "${key}".`);
    }

    return acc;
  }, {} as Record<string, IOverallModels>);

// ---------------------------------------------------------

const SECTION_POST_MODAL_MAP: Record<
  string,
  Model<any>
> = POST_DB.sections.reduce((acc, key) => {
  acc[key] = MODAL_MAP[key];
  return acc;
}, {} as Record<string, Model<any>>);

export { SECTION_POST_MODAL_MAP };

// ----------------------------------------------------------

const COMPONENT_POST_MODAL_MAP: Record<
  string,
  Model<any>
> = POST_DB.components.reduce((acc, key) => {
  acc[key] = MODAL_MAP[key];
  return acc;
}, {} as Record<string, Model<any>>);

export { COMPONENT_POST_MODAL_MAP };
