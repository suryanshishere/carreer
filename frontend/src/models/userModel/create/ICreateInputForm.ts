export interface ICreateInputForm {
    name: string;
    type: string;
    value?: string[];
    subItem?: ICreateInputForm[];
  }
  