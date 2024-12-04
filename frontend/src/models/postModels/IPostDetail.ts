import { IAdmission } from "./sectionInterfaces/IAdmission";
import { IAdmitCard } from "./sectionInterfaces/IAdmitCard";
import { IAnswerKey } from "./sectionInterfaces/IAnswerKey";
import { ICertificateVerification } from "./sectionInterfaces/ICertificateVerification";
import { IImportant } from "./sectionInterfaces/IImportant";
import { ILatestJob } from "./sectionInterfaces/ILatestJob";
import { IResult } from "./sectionInterfaces/IResult";
import { ISyllabus } from "./sectionInterfaces/ISyllabus";

export type IPostDetail =
  | ILatestJob
  | IResult
  | IAdmitCard
  | ISyllabus
  | IImportant
  | ICertificateVerification
  | IAnswerKey
  | IAdmission;
