import { Model } from "mongoose";
import POST_DB, {
  ISectionKey,
  IComponentKey,
  IOverallKey,
} from "@models/post_models/post_db";
import CertificateVerificationModel, {
  ICertificateVerification,
} from "@models/post_models/sectionModels/certificate_verification_model";
import DateModel, {
  IDate,
} from "@models/post_models/componentModels/date_model";
import LinkModel, {
  ILink,
} from "@models/post_models/componentModels/link_model";
import CommonModel, {
  ICommon,
} from "@models/post_models/componentModels/common_model";
import FeeModel, { IFee } from "@models/post_models/componentModels/fee_model";
import AdmissionModel, {
  IAdmission,
} from "@models/post_models/sectionModels/admission_model";
import ImportantModel, {
  IImportant,
} from "@models/post_models/sectionModels/important_model";
import AnswerKeyModel, {
  IAnswerKey,
} from "@models/post_models/sectionModels/answer_key_model";
import SyllabusModel, {
  ISyllabus,
} from "@models/post_models/sectionModels/syllabus_model";
import LatestJobModel, {
  ILatestJob,
} from "@models/post_models/sectionModels/latest_job_model";
import AdmitCardModel, {
  IAdmitCard,
} from "@models/post_models/sectionModels/admit_card_model";
import ResultModel, {
  IResult,
} from "@models/post_models/sectionModels/result_model";

// Explicitly type the models
const OVERALL_MODELS: Record<IOverallKey, Model<any> | undefined> = {
  certificate_verification:
    CertificateVerificationModel as Model<ICertificateVerification>,
  date: DateModel as Model<IDate>,
  link: LinkModel as Model<ILink>,
  common: CommonModel as Model<ICommon>,
  fee: FeeModel as Model<IFee>,
  admission: AdmissionModel as Model<IAdmission>,
  important: ImportantModel as Model<IImportant>,
  answer_key: AnswerKeyModel as Model<IAnswerKey>,
  syllabus: SyllabusModel as Model<ISyllabus>,
  latest_job: LatestJobModel as Model<ILatestJob>,
  admit_card: AdmitCardModel as Model<IAdmitCard>,
  result: ResultModel as Model<IResult>,
};

export const MODEL_MAP: Record<IOverallKey, Model<any>> = Object.fromEntries(
  POST_DB.overall.map((key) => {
    const model = OVERALL_MODELS[key];
    if (!model) console.warn(`Model for key "${key}" not found.`);
    return [key, model!];
  })
) as Record<IOverallKey, Model<any>>;

export const SECTION_POST_MODEL_MAP: Record<
  ISectionKey,
  Model<any>
> = Object.fromEntries(
  POST_DB.sections.map((key) => [key, MODEL_MAP[key]])
) as Record<ISectionKey, Model<any>>;

export const COMPONENT_POST_MODEL_MAP: Record<
  IComponentKey,
  Model<any>
> = Object.fromEntries(
  POST_DB.components.map((key) => [key, MODEL_MAP[key]])
) as Record<IComponentKey, Model<any>>;

export default POST_DB;
