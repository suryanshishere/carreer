import { ICommon } from "../../overallInterfaces/ICommon";
import { IDates } from "../../overallInterfaces/IDates";
import { IFees } from "../../overallInterfaces/IFees";
import { ILinks } from "../../overallInterfaces/ILinks";

export interface IHowToFillForm  {
  registration: string;
  apply: string;
  video_link: string | null;
}

export interface ILatestJobDetail  {
  how_to_fill_the_form?: IHowToFillForm;
  common?: ICommon;
  // syllabus?: Types.ObjectId;
  application_fee?: IFees;
  important_dates?: IDates;
  important_links?: ILinks;
  // result_data?: Types.ObjectId;
}
