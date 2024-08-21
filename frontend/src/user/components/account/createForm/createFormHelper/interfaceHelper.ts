import { IPostAdminData } from "models/admin/IPostAdminData";
import { ICreateInputForm } from "models/userModel/create/ICreateInputForm";


export interface ICreateSection{
  postformData: ICreateInputForm[]
}

export interface RowData {
  [key: string]: string | number | boolean;
}

export interface ITableFormData {
  [key: string]: RowData[];
}
