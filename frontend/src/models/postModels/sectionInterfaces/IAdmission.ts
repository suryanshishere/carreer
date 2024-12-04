import { ICommon } from "../overallInterfaces/ICommon";
import { IDates } from "../overallInterfaces/IDates";
import { ILinks } from "../overallInterfaces/ILinks";
import { ICommonData } from "./ICommonData";

export interface IAdmission extends ICommonData {
  post_common?: ICommon;
  important_dates?: IDates;
  important_links?: ILinks;
}
