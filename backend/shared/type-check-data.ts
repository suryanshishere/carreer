export interface IAdminData {
    IRoleApplied: "publisher" | "admin" | "approver" | "none";
    IStatus: "pending" | "approved" | "rejected";
    // IAdminStatus: "handlePublisher" | "handleApprover" | "admin" | "none";
}