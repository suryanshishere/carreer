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
import TableInput from "shared/utilComponents/form/input/TableInput";

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

const PostSectionForm: React.FC = () => {
  const [tableFormData, setTableFormData] = useState<ITableFormData[]>([]);
  const [postformData, setPostformData] = useState<IContributeInputForm[]>([]);
  const [tableFields, setTableFields] = useState<IContributeInputForm[]>([]); 
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

      // Filter only customArray or array types for table input
      const tableOnlyFields = selectedForm.filter(
        (field) => field.type === "customArray" || field.type === "array"
      );
      setTableFields(tableOnlyFields); // Set the fields for table
    }
  }, [post_section, undefinedFields]);


  const submitHandler = async (e: React.FormEvent) => {
    console.log("Table Form Data on Submit: ", tableFormData);
    const structuredObject = structureOverallFormData(
      e,
      tableFormData,
      postformData
    );
    try {
      if (!post_id && !post_section) {
        return;
      }
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
      // navigate(-1);
    } catch (err) {}
  };
  
  const handleTableInputData = (data: Record<string, any>) => {
    setTableFormData((prev) => [...prev, data]); // Append received data to tableFormData array
  };

  return (
    <form onSubmit={submitHandler} className="flex flex-col gap-2">
      {renderFormFields(postformData)}
      <div>
        {tableFields.length > 0 &&
          tableFields.map((item) => <TableInput key={item.name} data={item} tableInputData={handleTableInputData}/>)}
      </div>

      <Button type="submit">Submit</Button>
    </form>
  );
};

export default PostSectionForm;
