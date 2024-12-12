import { ICommon } from "../../overallInterfaces/ICommon";
import { IDates } from "../../overallInterfaces/IDates";
import { ILinks } from "../../overallInterfaces/ILinks";
import { ISyllabusDetail } from "./ISyllabusDetail";

export interface IAnswerKeyDetail {
  how_to_download_answer_key?: string;
  common?: ICommon;
  important_dates?: IDates;
  important_links?: ILinks;
  syllabus?: ISyllabusDetail;
}
