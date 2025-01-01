import { Model } from "mongoose";
import { POST_ENV_DATA } from "src/shared/env-data";
import { camelCase, upperFirst } from "lodash";
import CertificateVerificationModel from "src/models/post/sectionModels/certificate-verification-model";
import DateModel from "src/models/post/componentModels/date-model";
import LinkModel from "src/models/post/componentModels/link-model";
import CommonModel from "src/models/post/componentModels/common-model";
import FeeModel from "src/models/post/componentModels/fee-model";
import AdmissionModel from "src/models/post/sectionModels/admission-model";
import ImportantModel from "src/models/post/sectionModels/important-model";
import AnswerKeyModel from "src/models/post/sectionModels/answer-key-model";
import SyllabusModel from "src/models/post/sectionModels/syllabus-model";
import LatestJobModel from "src/models/post/sectionModels/latest-job-model";
import AdmitCardModel from "src/models/post/sectionModels/admit-card-model";
import ResultModel from "src/models/post/sectionModels/result-model";

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
  POST_ENV_DATA.OVERALL.reduce((acc, key) => {
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
> = POST_ENV_DATA.SECTIONS.reduce((acc, key) => {
  acc[key] = MODAL_MAP[key];
  return acc;
}, {} as Record<string, Model<any>>);

export { SECTION_POST_MODAL_MAP };

// ----------------------------------------------------------

const COMPONENT_POST_MODAL_MAP: Record<
  string,
  Model<any>
> = POST_ENV_DATA.COMPONENTS.reduce((acc, key) => {
  acc[key] = MODAL_MAP[key];
  return acc;
}, {} as Record<string, Model<any>>);

export { COMPONENT_POST_MODAL_MAP };
