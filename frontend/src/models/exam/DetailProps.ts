export type ValueItem = (string | number | { table: TableItem })[];

export type ObjectItem = { key: string; value: ValueItem } ;

export interface TableItem {
  column?: (string | number)[]; 
  row: ({ key: string; value: ValueItem } | (string | number)[])[]
}

export interface RelatedDetailPage {
  key: string;
  value: ValueItem;
}

export interface DetailPage {
  _id?: string;
  author: string;
  related_detail_page: RelatedDetailPage[];
}
