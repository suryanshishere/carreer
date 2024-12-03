import { IPostAdminData } from "models/admin/IPostAdminData";
import { IPostDetail } from "models/postModels/IPostDetail";
import { IContributeInputForm } from "models/userModel/account/contributeToPost/IContributeInputForm";

export interface ICreateSection {
  postformData: IContributeInputForm[];
  onSubmit: (data: IPostDetail) => void;
}

export interface RowData {
  [key: string]: string | number | boolean;
}

export interface ITableFormData {
  [key: string]: RowData[];
}
