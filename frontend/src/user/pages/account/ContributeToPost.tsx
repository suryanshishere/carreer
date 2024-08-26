import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHttpClient } from "shared/utilComponents/hooks/http-hook";
import { dataStatusUIAction } from "shared/utilComponents/store/dataStatus-ui-slice";
import { Dropdown } from "shared/utilComponents/form/input/Dropdown";
import POST_SECTION from "db/postDb/postSection.json";
import Button from "shared/utilComponents/form/Button";
import { IPostAdminData } from "models/admin/IPostAdminData";
import PostSectionForm from "user/components/account/createForm/PostSectionForm";
// import PostDatesForm from "user/components/account/createForm/createFormOverall/PostDatesForm";
// import PostFeesForm from "user/components/account/createForm/createFormOverall/PostFeesForm";
// import PostLinksForm from "user/components/account/createForm/createFormOverall/PostLinksForm";
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

const ContributeToPost: React.FC = () => {
  const { sendRequest, error } = useHttpClient();
  const dispatch = useDispatch();
  const [postIdItem, setPostIdItem] = useState<IContributeInputForm | null>(
    null
  );
  const [formComponents, setFormComponents] = useState<IContributeInputForm[]>(
    []
  );

  useEffect(() => {
    if (error) {
      dispatch(dataStatusUIAction.setErrorHandler(error));
    }
  }, [error, dispatch]);

  const getPostCodeHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const post_section = formData.get("post_section") as string;
    if (!post_section) return;

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

      setPostIdItem({ name: "_id", type: "text", value: responseDataValue });
      setFormComponents(formMap[firstKey] || []);
    } catch (err) {
      // Handle error if necessary
    }
  };

  // Add postIdItem to the formComponents array if it exists
  if (postIdItem && formComponents.length > 0) {
    formComponents.unshift(postIdItem);
    return <PostSectionForm postformData={formComponents} />;
  }

  return (
    <form onSubmit={getPostCodeHandler} className="flex gap-2">
      <Dropdown name="post_section" dropdownData={POST_SECTION} />
      <Button type="submit">Get Post Code</Button>
    </form>
  );
};

export default ContributeToPost;
