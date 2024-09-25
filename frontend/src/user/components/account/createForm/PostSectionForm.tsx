import React, { useEffect, useState } from "react";
import {
  // renderFormFields,
  structureOverallFormData,
} from "./createFormHelper/structure-json";
import Button from "shared/utilComponents/form/Button";
import { ITableFormData } from "./createFormHelper/interfaceHelper";
import TableCustomForm from "../../../../shared/utilComponents/form/input/TableCustomForm";
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

//TODO: dispatch related left (provide the error and response)
const PostSectionForm: React.FC = () => {
  const [tableFormData, setTableFormData] = useState<ITableFormData>({});
  const [postformData, setPostformData] = useState<IContributeInputForm[]>([]);
  const { sendRequest, error } = useHttpClient();
  const { post_section, post_id } = useParams();
  const { userId, token } = useUserData();
  const navigate = useNavigate();
  const undefinedFields = useSelector(
    (state: RootState) => state.undefinedFields.fields
  );
  const dispatch = useDispatch();
  // Update postFormData based on the post_section and undefinedFields
  useEffect(() => {
    if (post_section && formMap[post_section]) {
      // Filter postFormData based on undefinedFields
      const selectedForm = formMap[post_section].filter((formField) =>
        undefinedFields.includes(formField.name)
      );
      setPostformData(selectedForm);
    }
  }, [post_section, undefinedFields]);

  const tableInputData = (data: Record<string, any>) => {
    setTableFormData(data);
  };

  //TODO: removing the _id from the structureObject and just passing to postId
  const submitHandler = async (e: React.FormEvent) => {
    const structuredObject = structureOverallFormData(
      e,
      tableFormData,
      postformData
    );
    console.log(structuredObject)
    try {
      if(!post_id && !post_section){return;}
      const response = await sendRequest(
        `${process.env.REACT_APP_BASE_URL}/user/account/contribute_to_post`,
        "POST",
        JSON.stringify({ post_id, post_section, data: structuredObject }),
        {
          "Content-Type": "application/json",
          userid: userId || "",
          authorisation: "Bearer " + token,
        }
      );

      const responseData = response.data as unknown as {
        [key: string]: IPostAdminData[];
      };

      dispatch(undefinedFieldActions.clearFields());

      console.log(responseData);
      navigate(-1);
    } catch (err) {}
  };

  return (
    <form onSubmit={submitHandler} className="flex flex-col gap-2">
      {renderFormFields(postformData)}
      {/* <TableCustomForm data={postformData} onTableInputData={tableInputData} /> */}
      <Button>Submit</Button>
    </form>
  );
};

export default PostSectionForm;
