import { ICommon } from "../../overallInterfaces/ICommon";
import { IDates } from "../../overallInterfaces/IDates";
import { ILinks } from "../../overallInterfaces/ILinks";
import { ICommonDetailData } from "./ICommonDetailData";

export interface IImportantDetail extends ICommonDetailData {
    how_to_fill_the_form?: string;
    important_links?: ILinks;
    important_dates?: IDates;
    common?: ICommon;
  }