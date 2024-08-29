import React, { useEffect, useState } from "react";
import {
  renderFormFields,
  structureOverallFormData,
} from "./createFormHelper/helper";
import Button from "shared/utilComponents/form/Button";
import { TableForm } from "../../../../shared/utilComponents/form/input/TableForm";
import {
  ICreateSection,
  ITableFormData,
} from "./createFormHelper/interfaceHelper";
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
import { useDispatch } from "react-redux";
import { useHttpClient } from "shared/utilComponents/hooks/http-hook";
import { useParams } from "react-router-dom";

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
  const { sendRequest, error } = useHttpClient();
  const dispatch = useDispatch();
  const [tableFormData, setTableFormData] = useState<ITableFormData>({});
  const [postformData, setPostformData] = useState<IContributeInputForm[]>([]);
  const { post_section } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BASE_URL}/admin/public/post_admin_data`,
          "POST",
          JSON.stringify({ post_section }),
          {
            "Content-Type": "application/json",
          }
        );

        const responseData = response.data as unknown as {
          [key: string]: IPostAdminData[];
        };
        const firstKey = Object.keys(responseData)[0];
        const responseDataValue = responseData[firstKey] || [];

        const updatedPostFormData = [
          { name: "_id", type: "text", value: responseDataValue },
          ...(formMap[firstKey] || []),
        ];
        setPostformData(updatedPostFormData);
      } catch (err) {}
    };

    fetchData();
  }, [post_section, sendRequest]);

  const tableInputData = (data: Record<string, any>) => {
    setTableFormData(data);
  };

  //TODO
  const submitHandler = (e: React.FormEvent) => {
    const structuredObject = structureOverallFormData(
      e,
      tableFormData,
      postformData
    );

    console.log(structuredObject);
  };

  return (
    <form onSubmit={submitHandler} className="flex flex-col gap-2">
      <h2>Post Common Section</h2>
      {renderFormFields(postformData)}
      <TableCustomForm data={postformData} onTableInputData={tableInputData} />
      <Button>Submit</Button>
    </form>
  );
};

export default PostSectionForm;
