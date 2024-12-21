interface ICategoryFees {
  general?: number;
  obc?: number;
  ews?: number;
  sc?: number;
  st?: number;
  "ph_dviyang"?: number;
}

export interface IFees {
  createdAt: string;
  updatedAt: string;
  created_by: string;
  contributors?: string[];
  approved: boolean;
  male?: number;
  female?: number;
  category_wise?: ICategoryFees;
  additional_resources?: string;
}
