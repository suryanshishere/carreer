import { IDates } from "models/postModels/overallInterfaces/IDates";
import { ICommon } from "../../overallInterfaces/ICommon";
import { ILinks } from "../../overallInterfaces/ILinks";

export interface IResultDetail {
  how_to_download_result?: string;
  result?: IResultCategory;
  common?: ICommon;
  important_links?: ILinks;
  important_dates?: IDates;
}

interface IResultCategory {
  general?: number;
  obc?: number;
  ews?: number;
  sc?: number;
  st?: number;
  ph_dviyang?: number;
}
