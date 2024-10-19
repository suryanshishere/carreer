import { IPostAdminData } from "models/admin/IPostAdminData";

// Define a validation type
export interface IValidation {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    minWords?:number;
    maxWords?:number;
}

// Extend the original interface to include validation
export interface IContributeInputForm {
    name: string;
    type: string;
    value?: string[] | IPostAdminData[]; // Dropdown options or specific data array
    subItem?: IContributeInputForm[]; // Nested items for objects or arrays
    validation?: IValidation; // Validation rules for the field
}
