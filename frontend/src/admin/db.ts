export type IStatus = "pending" | "approved" | "rejected";

interface IAdminDb {
  status: IStatus[];
  status_classname: {
    [key: string]: string;
  };
  role_applied: string[];
}

const STATUS: IStatus[] = ["rejected", "pending", "approved"];
const STATUS_CLASSNAME = {
  pending: "text-custom_less_gray hover:bg-custom_less_gray hover:text-custom_white rounded border px-3 ",
  rejected: "text-custom_red hover:bg-custom_red hover:text-custom_white rounded border px-3 ",
  approved: "text-custom_green hover:bg-custom_green hover:text-custom_white rounded border px-3 ",
};

const ADMIN_DB: IAdminDb = {
  status: STATUS,
  status_classname: STATUS_CLASSNAME,
  role_applied: ["publisher", "approver", "admin"],
};

export default ADMIN_DB;

export type IRole = "approver" | "publisher" | "admin" | "none";

export interface IPostAdminData {
  _id: string;
  name_of_the_post: string;
}

export const CONTRIBUTER_DB = {
  status: STATUS,
  status_classname: STATUS_CLASSNAME,
};
