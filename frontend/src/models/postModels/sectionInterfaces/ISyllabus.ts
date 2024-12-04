import { ICommon } from "../overallInterfaces/ICommon";
import { IDates } from "../overallInterfaces/IDates";
import { ILinks } from "../overallInterfaces/ILinks";
import { ICommonData } from "./ICommonData";

interface ISyllabusData {
  section: string;
  topics: string;
}

export interface ISyllabus extends ICommonData {
  syllabus?: ISyllabusData[];
  important_links?: ILinks;
  important_dates?: IDates;
  common?: ICommon;
}
