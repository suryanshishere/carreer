interface ICategoryFees {
  general?: number;
  obc?: number;
  ews?: number;
  sc?: number;
  st?: number;
  "ph_(dviyang)"?: number;
}

export interface IFees {
  createdAt: string;
  updatedAt: string;
  created_by: string;
  contributors?: string[];
  approved: boolean;
  male?: ICategoryFees;
  female?: ICategoryFees;
  other?: ICategoryFees;
  additional_resources?: string;
}
