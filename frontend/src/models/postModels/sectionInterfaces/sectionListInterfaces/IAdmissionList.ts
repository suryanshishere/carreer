import { IDates } from "models/postModels/overallInterfaces/IDates";
import { ILinks } from "models/postModels/overallInterfaces/ILinks";

export interface IAdmissionList {
    important_links?: ILinks;
    important_dates?: IDates;
}
