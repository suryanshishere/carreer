import SHARED_DB from "./shared-db";

interface IAdminDb {
  status: string[];
  status_classname: {
    [key: string]: string;
  };
  role_applied: string[];
}

const ADMIN_DB: IAdminDb = {
  status: SHARED_DB.status,
  status_classname: SHARED_DB.status_classname,
  role_applied: ["publisher", "approver", "admin"],
};

export default ADMIN_DB;
