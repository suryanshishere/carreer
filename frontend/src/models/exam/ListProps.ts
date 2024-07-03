export interface ExamListItem {
  _id: string;
  title: string;
  detail_title?: string;
  last_updated: string; 
  category: string;
  category_title: string;
  bookmarked?: boolean;
}
