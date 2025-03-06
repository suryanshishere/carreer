import {
  IAdmission,
  IAdmissionList,
  IAdmitCard,
  IAdmitCardList,
  IAnswerKey,
  ICertificateVerification,
  ICertificateVerificationList,
  ICommonDetailData,
  ICommonListData,
  IImportant,
  IImportantList,
  ILatestJob,
  ILatestJobList,
  IResult,
  IResultList,
  ISyllabus,
  ISyllabusList,
} from "./ISection";

export type IPostDetail =
  | ICommonDetailData
  | ILatestJob
  | IResult
  | IAdmitCard
  | ISyllabus
  | IImportant
  | ICertificateVerification
  | IAnswerKey
  | IAdmission;

//preventing mutliple
export type IPostListData = ICommonListData &
  IResultList &
  ILatestJobList &
  IAdmissionList &
  IAdmitCardList &
  ICertificateVerificationList &
  ISyllabusList &
  IImportantList;

export type IPostList = Array<
  ICommonListData &
    IResultList &
    ILatestJobList &
    IAdmissionList &
    IAdmitCardList &
    ICertificateVerificationList &
    ISyllabusList &
    IImportantList
>;
