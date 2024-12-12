import { ILinks } from "models/postModels/overallInterfaces/ILinks";

export interface IResultList {
  result?: IResultCategory;
  important_links?: ILinks;
}
interface IResultCategory {
  general?: number;
  obc?: number;
  ews?: number;
  sc?: number;
  st?: number;
  ph_dviyang?: number;
}