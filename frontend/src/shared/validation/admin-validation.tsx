import * as Yup from "yup"; 
import { POST_ENV_DATA } from "env-data";

const {MIN_POST_CODE, MAX_POST_CODE, MIN_POST_NAME_PUBLISHER,MAX_POST_NAME_PUBLISHER,SECTIONS,ALPHA_NUM_UNDERSCORE_SPACE} = POST_ENV_DATA;


//Publisher---------------------------------------------------------------------------
export interface ICreateNewPostForm {
    name_of_the_post: string;
    post_code: string;
    section: string;
    api_key?:string;
  }

export const validationSchema = Yup.object().shape({
    name_of_the_post: Yup.string()
      .min(MIN_POST_NAME_PUBLISHER, `Name of the post must be between 6 and 1000 characters.`)
      .max(MAX_POST_NAME_PUBLISHER, `Name of the post must be between 6 and 1000 characters.`)
      .required("Name of the post is required"),
    post_code: Yup.string()
      .min(MIN_POST_CODE, `Post code must be between 6 and 1000 characters.`)
      .max(MAX_POST_CODE, `Post code must be between 6 and 1000 characters.`)
      .matches(
        ALPHA_NUM_UNDERSCORE_SPACE,
        "Post code can only contain letters, numbers, and spaces."
      )
      .required("Post code is required"),
    api_key: Yup.string(),
    section: Yup.string()
      .required("Please select an option.")
      .oneOf(SECTIONS, `Status should be one of: ${SECTIONS.join(", ")}.`),
  });
  