import React, { useEffect, useState } from "react";
import {
  renderFormFields,
  structureOverallFormData,
} from "./createFormHelper/helper";
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
  const { sendRequest, error } = useHttpClient();
  const {userId, token} = useUserData()
  const [tableFormData, setTableFormData] = useState<ITableFormData>({});
  const [postformData, setPostformData] = useState<IContributeInputForm[]>([]);
  const { post_section } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BASE_URL}/admin/public/${post_section}/post_admin_data`,
          "GET",
          null,
          {
            userid: userId || "",
            Authorisation: "Bearer " + token,
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
        if (responseDataValue.length > 0) {
          setPostformData(updatedPostFormData);
        } else {
          navigate(-1);
        }
      } catch (err) {}
    };

    fetchData();
  }, [post_section]);

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

    const postId = structuredObject._id;
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BASE_URL}/user/account/contribute_to_post`,
        "POST",
        JSON.stringify({ postId, post_section, data: structuredObject }),
        {
          "Content-Type": "application/json",
          userid: userId || "",
          authorisation: "Bearer " + token,
        }
      );

      const responseData = response.data as unknown as {
        [key: string]: IPostAdminData[];
      };
      console.log(responseData);
    } catch (err) {}
  };

  return (
    <form onSubmit={submitHandler} className="flex flex-col gap-2">
      {renderFormFields(postformData)}
      <TableCustomForm data={postformData} onTableInputData={tableInputData} />
      <Button>Submit</Button>
    </form>
  );
};

export default PostSectionForm;
