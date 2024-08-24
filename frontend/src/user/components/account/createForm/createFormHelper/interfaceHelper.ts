import { IPostAdminData } from "models/admin/IPostAdminData";
import { IContributeInputForm } from "models/userModel/account/contributeToPost/IContributeInputForm";


export interface ICreateSection{
  postformData: IContributeInputForm[]
}

export interface RowData {
  [key: string]: string | number | boolean;
}

export interface ITableFormData {
  [key: string]: RowData[];
}
