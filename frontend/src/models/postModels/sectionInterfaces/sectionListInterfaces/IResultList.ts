import {
  ICommon,
  ICommonCategoryWise,
} from "models/postModels/overallInterfaces/ICommon";
import { ILinks } from "models/postModels/overallInterfaces/ILinks";

export interface IResultList {
  result?: ICommonCategoryWise;
  important_links?: ILinks;
}
