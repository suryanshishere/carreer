export type IStatus =  "pending" | "approved" | "rejected";

export interface IAdminData {
  IRoleApplied: IRole
  IStatus: IStatus
  // IAdminStatus: "handlePublisher" | "handleApprover" | "admin" | "none";
}

export type IRole = "publisher" | "admin" | "approver" | "none";

interface ContactUsEnvData {
  MIN_NAME_LENGTH: number;
  MAX_NAME_LENGTH: number;
  MIN_REASON_LENGTH: number;
  MAX_REASON_LENGTH: number;
}

interface AdminData {
  STATUS: IStatus[];
  STATUS_DEFAULT: string;
  ROLE_APPLIED: IRole[];
  REQUEST_DOC_EXPIRY: number;
}

// -------------------------------------------

export const CONTACT_US_ENV_DATA: ContactUsEnvData = {
  MIN_NAME_LENGTH: Number(process.env.MIN_NAME_LENGTH) || 3,
  MAX_NAME_LENGTH: Number(process.env.MAX_NAME_LENGTH) || 100,
  MIN_REASON_LENGTH: Number(process.env.MIN_REASON_LENGTH) || 100,
  MAX_REASON_LENGTH: Number(process.env.MAX_REASON_LENGTH) || 500,
};

// ---------------------------------------------

// enum AccountMode {
//   MAX = "max",
// }

// export type AccountModeType = keyof typeof AccountMode;

export const ADMIN_DATA: AdminData = {
  STATUS: ["pending", "approved", "rejected"],
  STATUS_DEFAULT: "pending",
  ROLE_APPLIED: ["publisher", "admin", "approver", "none"],
  REQUEST_DOC_EXPIRY: 43200, // in min (everything is in minute)
};
