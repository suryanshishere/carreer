import { ICommon } from "../../overallInterfaces/ICommon";
import { IDates } from "../../overallInterfaces/IDates";
import { ILinks } from "../../overallInterfaces/ILinks";
import { ICommonDetailData } from "./ICommonDetailData";

export interface IAdmissionDetail extends ICommonDetailData {
  post_common?: ICommon;
  important_dates?: IDates;
  important_links?: ILinks;
}
