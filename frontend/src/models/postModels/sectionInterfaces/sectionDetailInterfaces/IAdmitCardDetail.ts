import { ICommon } from "../../overallInterfaces/ICommon";
import { IDates } from "../../overallInterfaces/IDates";
import { ILinks } from "../../overallInterfaces/ILinks";

export interface IAdmitCardDetail {
  how_to_download_admit_card?: string;
  // syllabus?: Types.ObjectId;
  common?: ICommon;
  important_dates?: IDates;
  important_links?: ILinks;
}
