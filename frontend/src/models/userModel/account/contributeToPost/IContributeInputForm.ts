import { IPostAdminData } from "models/admin/IPostAdminData";

export interface IContributeInputForm {
    name: string;
    type: string;
    value?: string[] | IPostAdminData[];
    subItem?: IContributeInputForm[];
  }
  
