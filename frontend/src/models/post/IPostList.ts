export interface ICategoryPostList{

}

export interface IPostListData {
  name_of_the_post: string;
  post_code: string;
  _id:string;
}

export interface IPostList {
  [key: string]: IPostListData[];
}
