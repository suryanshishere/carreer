import { ICommon } from "../overallInterfaces/ICommon";
import { IDates } from "../overallInterfaces/IDates";
import { ILinks } from "../overallInterfaces/ILinks";
import { ICommonData } from "./ICommonData";

export interface ICertificateVerification extends ICommonData {
  how_to_fill_the_form?: string;
  common?: ICommon;
  important_dates?: IDates;
  important_links?: ILinks;
}
