interface ICategoryFees {
  general?: number;
  obc?: number;
  ews?: number;
  sc?: number;
  st?: number;
  "ph_(dviyang)"?: number;
}

export interface IFees {
  male?: ICategoryFees;
  female?: ICategoryFees;
  other?: ICategoryFees;
  additional_resources?: string;
}
