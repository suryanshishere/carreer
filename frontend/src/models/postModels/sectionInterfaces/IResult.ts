import { ICategoryWiseVacancy, ICommon } from "../overallInterfaces/ICommon";
import { ILinks } from "../overallInterfaces/ILinks";
import { ICommonData } from "./ICommonData";

export interface IResult extends ICommonData {
  how_to_download_result?: string;
  result?: ICategoryWiseVacancy;
  common?: ICommon;
  important_links?: ILinks;
}
