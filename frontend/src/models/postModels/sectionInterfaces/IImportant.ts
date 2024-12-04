import { ICommon } from "../overallInterfaces/ICommon";
import { IDates } from "../overallInterfaces/IDates";
import { ILinks } from "../overallInterfaces/ILinks";
import { ICommonData } from "./ICommonData";

export interface IImportant extends ICommonData {
    how_to_fill_the_form?: string;
    important_links?: ILinks;
    common?: ICommon;
    important_dates?: IDates;
  }