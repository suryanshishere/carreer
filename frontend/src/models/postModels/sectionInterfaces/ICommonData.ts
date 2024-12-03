
export interface ICommonData extends Document {
    createdAt: string;
    updatedAt: string;
    created_by: string;
    contributors?: string[]; //todo: for better user presentation convert to populate
    approved: boolean;
    name_of_the_post: string;
  }
  