export interface IList {
  _id: string;
  name_of_the_post: string;
  category: string;
  application_begin: {
    current_year: string;
    previous_year: string;
  };
}

//remember: name_of_the_post (exam_code treated) is hashed and treated as _id for the detail
