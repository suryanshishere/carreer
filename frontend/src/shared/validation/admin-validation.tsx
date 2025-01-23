import * as Yup from "yup";
import { POST_DB, POST_LIMITS_DB } from "db/post-db";

const { short_char_limit, alpha_num_underscore_space } = POST_LIMITS_DB;

//Publisher---------------------------------------------------------------------------
export interface ICreateNewPostForm {
  name_of_the_post: string;
  post_code: string;
  section: string;
  api_key?: string;
}

export const validationSchema = Yup.object().shape({
  name_of_the_post: Yup.string()
    .min(
      short_char_limit.min,
      `Name of the post must be between ${short_char_limit.min}-${short_char_limit.max} characters.`
    )
    .max(
      short_char_limit.max,
      `Name of the post must be between ${short_char_limit.min}-${short_char_limit.max} characters.`
    )
    .required("Name of the post is required."),
  post_code: Yup.string()
    .min(
      short_char_limit.min,
      `Post code must be between ${short_char_limit.min}-${short_char_limit.max} characters.`
    )
    .max(
      short_char_limit.max,
      `Post code must be between ${short_char_limit.min}-${short_char_limit.max} characters.`
    )
    .matches(
      alpha_num_underscore_space,
      "Post code can only contain letters, numbers, and spaces."
    )
    .required("Post code is required"),
  api_key: Yup.string(),
  section: Yup.string()
    .required("Please select an option.")
    .oneOf(
      POST_DB.sections,
      `Section should be one of: ${POST_DB.sections.join(", ")}.`
    ),
});
