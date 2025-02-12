const SHARED_DB = {
  status: ["rejected", "pending", "approved"],
  status_classname: {
    pending: "text-custom-less-gray hover:bg-custom-less-gray",
    rejected: "text-custom-red hover:bg-custom-red",
    approved: "text-custom-green hover:bg-custom-green",
  },
};

export default SHARED_DB;