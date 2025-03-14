import { Model } from "mongoose";
import POST_DB, {
  ISectionKey,
  IComponentKey,
  IOverallKey,
} from "@models/posts/db";
import CertificateVerificationModel, {
  ICertificateVerification,
} from "@models/posts/sections/CertificateVerfication";
import DateModel, {
  IDates,
} from "@models/posts/components/Date";
import LinkModel, {
  ILink,
} from "@models/posts/components/Link";
import CommonModel, {
  ICommon,
} from "@models/posts/components/Common";
import FeeModel, { IFee } from "@models/posts/components/Fee";
import AdmissionModel, {
  IAdmission,
} from "@models/posts/sections/Admission";
import ImportantModel, {
  IImportant,
} from "@models/posts/sections/Important";
import AnswerKeyModel, {
  IAnswerKey,
} from "@models/posts/sections/AnswerKey";
import SyllabusModel, {
  ISyllabus,
} from "@models/posts/sections/Syllabus";
import LatestJobModel, {
  ILatestJob,
} from "@models/posts/sections/LatestJob";
import AdmitCardModel, {
  IAdmitCard,
} from "@models/posts/sections/AdmitCard";
import ResultModel, {
  IResult,
} from "@models/posts/sections/Result";

// Explicitly type the models
const OVERALL_MODELS: Record<IOverallKey, Model<any> | undefined> = {
  certificate_verification:
    CertificateVerificationModel as Model<ICertificateVerification>,
  date: DateModel as Model<IDates>,
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
