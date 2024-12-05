import { IAdmissionDetail } from "./sectionInterfaces/sectionDetailInterfaces/IAdmissionDetail";
import { IAdmitCardDetail } from "./sectionInterfaces/sectionDetailInterfaces/IAdmitCardDetail";
import { IAnswerKeyDetail } from "./sectionInterfaces/sectionDetailInterfaces/IAnswerKeyDetail";
import { ICertificateVerificationDetail } from "./sectionInterfaces/sectionDetailInterfaces/ICertificateVerificationDetail";
import { IImportantDetail } from "./sectionInterfaces/sectionDetailInterfaces/IImportantDetail";
import { ILatestJobDetail } from "./sectionInterfaces/sectionDetailInterfaces/ILatestJobDetail";
import { IResultDetail } from "./sectionInterfaces/sectionDetailInterfaces/IResultDetail";
import { ISyllabusDetail } from "./sectionInterfaces/sectionDetailInterfaces/ISyllabusDetail";

export type IPostDetail =
  | ILatestJobDetail
  | IResultDetail
  | IAdmitCardDetail
  | ISyllabusDetail
  | IImportantDetail
  | ICertificateVerificationDetail
  | IAnswerKeyDetail
  | IAdmissionDetail;
