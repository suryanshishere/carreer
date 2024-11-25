export interface ICategoryPostList{

}

export interface IPostListData {
  name_of_the_post: string;
  post_code: string;
  _id:string;
  is_saved: boolean;
}

export interface IPostList {
  [key: string]: IPostListData[];
}
