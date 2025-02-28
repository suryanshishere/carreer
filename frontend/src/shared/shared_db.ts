const SHARED_DB = {
  status: ["rejected", "pending", "approved"],
  status_classname: {
    pending: "text-custom_less_gray hover:bg-custom_less_gray",
    rejected: "text-custom_red hover:bg-custom_red",
    approved: "text-custom_green hover:bg-custom_green",
  },
};

export default SHARED_DB;

// -----------------------------

interface IResponseDb {
  not_authenticated: string;
}

export const RESPONSE_DB: IResponseDb = {
  not_authenticated: "Not authenticated, please login or signup to continue!",
};
