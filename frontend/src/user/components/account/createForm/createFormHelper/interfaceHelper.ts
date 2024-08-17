import { IPostAdminData } from "models/admin/IPostAdminData";

export interface ICreateForm {
  idData: IPostAdminData[];
}

export interface RowData {
  [key: string]: string | number | boolean;
}

export interface ITableFormData {
  [key: string]: RowData[];
}
