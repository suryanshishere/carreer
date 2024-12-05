import { ICommonCategoryWise, ICommon } from "../../overallInterfaces/ICommon";
import { ILinks } from "../../overallInterfaces/ILinks";
import { ICommonDetailData } from "./ICommonDetailData";

export interface IResultDetail extends ICommonDetailData {
  how_to_download_result?: string;
  result?: ICommonCategoryWise;
  common?: ICommon;
  important_links?: ILinks;
}
