import { Model } from "mongoose";
import POST_DB, {
  ISectionKey,
  IComponentKey,
  IOverallKey,
} from "@models/post-model/post-db";
import CertificateVerificationModel, {
  ICertificateVerification,
} from "@models/post-model/post-section-model/CertificateVerfication";
import DateModel, {
  IDate,
} from "@models/post-model/post-component-model/Date";
import LinkModel, {
  ILink,
} from "@models/post-model/post-component-model/Link";
import CommonModel, {
  ICommon,
} from "@models/post-model/post-component-model/Common";
import FeeModel, { IFee } from "@models/post-model/post-component-model/Fee";
import AdmissionModel, {
  IAdmission,
} from "@models/post-model/post-section-model/Admission";
import ImportantModel, {
  IImportant,
} from "@models/post-model/post-section-model/Important";
import AnswerKeyModel, {
  IAnswerKey,
} from "@models/post-model/post-section-model/AnswerKey";
import SyllabusModel, {
  ISyllabus,
} from "@models/post-model/post-section-model/Syllabus";
import LatestJobModel, {
  ILatestJob,
} from "@models/post-model/post-section-model/LatestJob";
import AdmitCardModel, {
  IAdmitCard,
} from "@models/post-model/post-section-model/AdmitCard";
import ResultModel, {
  IResult,
} from "@models/post-model/post-section-model/Result";

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
