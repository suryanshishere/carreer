import { ICommon } from "../../overallInterfaces/ICommon";
import { IDates } from "../../overallInterfaces/IDates";
import { ILinks } from "../../overallInterfaces/ILinks";
import { ICommonDetailData } from "./ICommonDetailData";
import { IResultDetail } from "./IResultDetail";

export interface IAdmitCardDetail extends ICommonDetailData {
  how_to_download_admit_card?: string;
  // syllabus?: Types.ObjectId;
  common?: ICommon;
  important_dates?: IDates;
  important_links?: ILinks;
}
