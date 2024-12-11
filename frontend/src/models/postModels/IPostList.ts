import { ICommonListData } from "./sectionInterfaces/sectionListInterfaces/ICommonListData";
import { IResultList } from "./sectionInterfaces/sectionListInterfaces/IResultList";
import { ILatestJobList } from "./sectionInterfaces/sectionListInterfaces/ILatestJobList";
import { IAdmissionList } from "./sectionInterfaces/sectionListInterfaces/IAdmissionList";
import { IAdmitCardList } from "./sectionInterfaces/sectionListInterfaces/IAdmitCardList";
import { ICertificateVerificationList } from "./sectionInterfaces/sectionListInterfaces/ICertificateVerificationList";
import { ISyllabusList } from "./sectionInterfaces/sectionListInterfaces/ISyllabusList";
import { IImportantList } from "./sectionInterfaces/sectionListInterfaces/IImportantList";

//preventing mutliple
export type IPostListData =
  | ICommonListData
  | IResultList
  | ILatestJobList
  | IAdmissionList
  | IAdmitCardList
  | ICertificateVerificationList
  | ISyllabusList
  | IImportantList;

export type IPostList = Array<
  ICommonListData &
    (
      | IResultList
      | ILatestJobList
      | IAdmissionList
      | IAdmitCardList
      | ICertificateVerificationList
      | ISyllabusList
      | IImportantList
    )
>;

