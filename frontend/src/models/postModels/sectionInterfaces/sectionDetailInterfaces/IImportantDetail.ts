import { ICommon } from "../../overallInterfaces/ICommon";
import { IDates } from "../../overallInterfaces/IDates";
import { ILinks } from "../../overallInterfaces/ILinks";

export interface IImportantDetail  {
    how_to_fill_the_form?: string;
    important_links?: ILinks;
    important_dates?: IDates;
    common?: ICommon;
  }