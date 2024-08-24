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

enum SectionState {
  post_common = "post_common",
  result = "result",
  admit_card = "admit_card",
  latest_job = "latest_job",
  answer_key = "answer_key",
  syllabus = "syllabus",
  certificate_verification = "certificate_verification",
  admission = "admission",
  important = "important",
  default = "default",
}

const sectionMap: Record<string, SectionState> = {
  post_common: SectionState.post_common,
  result: SectionState.result,
  admit_card: SectionState.admit_card,
  latest_job: SectionState.latest_job,
  answer_key: SectionState.answer_key,
  syllabus: SectionState.syllabus,
  certificate_verification: SectionState.certificate_verification,
  admission: SectionState.admission,
  important: SectionState.important,
};


const ContributeToPost: React.FC = () => {
  // const { token, userId } = useUserData();
  const { sendRequest, error } = useHttpClient();
  const dispatch = useDispatch();
  const [postIdItem, setPostIdItem] = useState<IContributeInputForm | null>(null);
  const [section, setSection] = useState(SectionState.default);

  useEffect(() => {
    if (error) {
      dispatch(dataStatusUIAction.setErrorHandler(error));
    }
  }, [error, dispatch]);

  const getPostCodeHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const post_section = formData.get("post_section");
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

      // console.log(post_section)

      setPostIdItem({ name: "_id", type: "text", value: responseDataValue });
      setSection(firstKey ? sectionMap[firstKey] : SectionState.default);
    } catch (err) {
    }
  };

  const getComponentBySection = (section: SectionState): IContributeInputForm[] => {
    switch (section) {
      case SectionState.post_common:
        return POST_COMMON_FORM;
      case SectionState.admission:
        return ADMISSION_FORM;
      case SectionState.admit_card:
        return ADMIT_CARD_FORM;
      case SectionState.answer_key:
        return ANSWER_KEY_FORM;
      case SectionState.latest_job:
        return LATEST_JOB_FORM;
      case SectionState.result:
        return RESULT_FORM;
      case SectionState.syllabus:
        return SYLLABUS_FORM;
      case SectionState.certificate_verification:
        return CERTIFICATE_VERIFICATION_FORM;
      case SectionState.important:
        return POST_IMPORTANT_FORM;
      default:
        return [];
    }
  };

  const component: IContributeInputForm[] = getComponentBySection(section);

  // Add postIdItem to the component array if it exists
  if (postIdItem && component.length > 0) {
    component.unshift(postIdItem);
    return <PostSectionForm postformData={component} />;
  }

  return (
    <form onSubmit={getPostCodeHandler} className="flex gap-2">
      <Dropdown name="post_section" dropdownData={POST_SECTION} />
      <Button type="submit">Get Post Code</Button>
    </form>
  );
};

export default ContributeToPost;
