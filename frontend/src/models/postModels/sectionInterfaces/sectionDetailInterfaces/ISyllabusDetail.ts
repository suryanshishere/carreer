import { ICommon } from "../../overallInterfaces/ICommon";
import { IDates } from "../../overallInterfaces/IDates";
import { ILinks } from "../../overallInterfaces/ILinks";

interface ISyllabusData {
  section: string;
  topics: string;
}

export interface ISyllabusDetail  {
  syllabus?: ISyllabusData[];
  important_links?: ILinks;
  important_dates?: IDates;
  common?: ICommon;
}
