import { IPostAdminData } from "models/admin/IPostAdminData";

export interface ICreateInputForm {
    name: string;
    type: string;
    value?: string[] | IPostAdminData[];
    subItem?: ICreateInputForm[];
  }
  