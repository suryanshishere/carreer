import React, { useEffect, useState } from "react";
import { structureOverallFormData } from "./createFormHelper/structure-json";
import Button from "shared/utilComponents/form/Button";
import { ITableFormData } from "./createFormHelper/interfaceHelper";
import { IContributeInputForm } from "models/userModel/account/contributeToPost/IContributeInputForm";
import {
  POST_COMMON_FORM,
  SYLLABUS_FORM,
  ADMIT_CARD_FORM,
  ADMISSION_FORM,
  LATEST_JOB_FORM,
  CERTIFICATE_VERIFICATION_FORM,
  RESULT_FORM,
  POST_IMPORTANT_FORM,
  ANSWER_KEY_FORM,
} from "db/userDb/createDb/sectionFormsDb";
import { IPostAdminData } from "models/admin/IPostAdminData";
import { useHttpClient } from "shared/utilComponents/hooks/http-hook";
import { useNavigate, useParams } from "react-router-dom";
import useUserData from "shared/utilComponents/localStorageConfig/use-userData-hook";
import renderFormFields from "./createFormHelper/render-form-fields";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "shared/utilComponents/store";
import { undefinedFieldActions } from "shared/utilComponents/store/undefined-fields";

const formMap: Record<string, IContributeInputForm[]> = {
  post_common: POST_COMMON_FORM,
  result: RESULT_FORM,
  admit_card: ADMIT_CARD_FORM,
  latest_job: LATEST_JOB_FORM,
  answer_key: ANSWER_KEY_FORM,
  syllabus: SYLLABUS_FORM,
  certificate_verification: CERTIFICATE_VERIFICATION_FORM,
  admission: ADMISSION_FORM,
  important: POST_IMPORTANT_FORM,
};

//TODO: If the link is directly pasted, it's should be able to make up the form anyhow (hint: combining the postfinalizer and postsectionfrom into one)

const PostSectionForm: React.FC = () => {
  const { post_section, post_id } = useParams();
  const { userId, token } = useUserData();
  const navigate = useNavigate();
  const { sendRequest, error } = useHttpClient();
  const [tableFormData, setTableFormData] = useState<ITableFormData[]>([]);

  const dispatch = useDispatch();
  const { fields, postFormData } = useSelector(
    (state: RootState) => state.undefinedFields
  );

  // Hydrate the Redux state from localStorage on component mount
  useEffect(() => {
    dispatch(undefinedFieldActions.restoreState());
  }, [dispatch]);

  useEffect(() => {
    if (post_section) {
      const newFormMap = formMap[post_section];
      if (newFormMap && fields.length > 0) {
        const selectedForm = newFormMap.filter((formField) =>
          fields.includes(formField.name)
        );
        dispatch(undefinedFieldActions.setPostformData(selectedForm));
      }
    }
  }, [post_section, fields, dispatch]);

  // Handle form submission
  const submitHandler = async (e: React.FormEvent) => {
    // console.log("Table Form Data on Submit: ", tableFormData);
    e.preventDefault();
    const structuredObject = structureOverallFormData(
      e,
      tableFormData,
      postFormData
    );

    console.log(structuredObject);
    try {
      if (!post_id && !post_section) {
        return;
      }
      // const response = await sendRequest(
      //   `${process.env.REACT_APP_BASE_URL}/user/account/contribute_to_post`,
      //   "POST",
      //   JSON.stringify({ post_id, post_section, data: structuredObject }),
      //   {
      //     "Content-Type": "application/json",
      //     userid: userId || "",
      //     authorisation: "Bearer " + token,
      //   }
      // );

      // const responseData = response.data as unknown as {
      //   [key: string]: IPostAdminData[];
      // };

      // dispatch(undefinedFieldActions.clearFields());
      // dispatch(undefinedFieldActions.clearFormData());

      // console.log(responseData);
      // navigate(-1); // Uncomment to navigate back after submission
    } catch (err) {}
  };

  // Handle table form data updates
  const handleTableInputData = (data: Record<string, any>) => {
    setTableFormData((prev) => [...prev, data]);
  };

  return (
    <form onSubmit={submitHandler} className="flex flex-col gap-2">
      {renderFormFields(postFormData, handleTableInputData)}
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default PostSectionForm;
