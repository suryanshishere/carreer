interface IAdminDb {
  status: string[];
  status_classname: {
    [key: string]: string;
  };
  role_applied: string[];
}

const ADMIN_DB: IAdminDb = {
  status: ["rejected", "pending", "approved"],
  status_classname: {
    pending: "text-custom-less-gray hover:bg-custom-less-gray",
    rejected: "text-custom-red hover:bg-custom-red",
    approved: "text-custom-green hover:bg-custom-green",
  },
  role_applied: ["publisher", "approver", "admin"],
};

export default ADMIN_DB;
