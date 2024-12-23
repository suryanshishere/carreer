import { ICommon } from "../../overallInterfaces/ICommon";
import { IDates } from "../../overallInterfaces/IDates";
import { ILinks } from "../../overallInterfaces/ILinks";

export interface IAdmissionDetail  {
  post_common?: ICommon;
  important_dates?: IDates;
  important_links?: ILinks;
}
