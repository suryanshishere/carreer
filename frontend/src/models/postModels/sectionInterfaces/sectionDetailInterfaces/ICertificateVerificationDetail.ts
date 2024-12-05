import { ICommon } from "../../overallInterfaces/ICommon";
import { IDates } from "../../overallInterfaces/IDates";
import { ILinks } from "../../overallInterfaces/ILinks";
import { ICommonDetailData } from "./ICommonDetailData";

export interface ICertificateVerificationDetail extends ICommonDetailData {
  how_to_fill_the_form?: string;
  common?: ICommon;
  important_dates?: IDates;
  important_links?: ILinks;
}
