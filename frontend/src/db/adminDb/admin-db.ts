type AdminDbType = {
  STATUS: string[];
  STATUS_CLASSNAME: {
    [key: string]: string;
  };
  ROLE_APPLIED: string[];
};

const ADMIN_DB: AdminDbType = {
  STATUS: ["rejected", "pending", "approved"],
  STATUS_CLASSNAME: {
    pending: "text-custom-less-gray hover:bg-custom-less-gray",
    rejected: "text-custom-red hover:bg-custom-red",
    approved: "text-custom-green hover:bg-custom-green",
  },
  ROLE_APPLIED: ["publisher", "approver", "admin"],
};

export default ADMIN_DB;
