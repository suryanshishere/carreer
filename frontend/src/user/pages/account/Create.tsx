import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHttpClient } from "shared/utilComponents/hooks/http-hook";
import { dataStatusUIAction } from "shared/utilComponents/store/dataStatus-ui-slice";
import useUserData from "shared/utilComponents/localStorageConfig/use-userData-hook";
import { Dropdown } from "shared/utilComponents/form/input/Dropdown";
import POST_SECTION from "db/postDb/postSection.json";
import Button from "shared/utilComponents/form/Button";
import { IPostAdminData } from "models/admin/IPostAdminData";
import PostCommonForm from "user/components/account/createForm/PostCommonForm";

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

// Mapping from backend key to SectionState
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

const Create: React.FC = () => {
  const { token, userId } = useUserData();
  const { sendRequest, error } = useHttpClient();
  const dispatch = useDispatch();
  const [data, setData] = useState<IPostAdminData[]>([]);
  const [section, setSection] = useState(SectionState.default);

  useEffect(() => {
    dispatch(dataStatusUIAction.setErrorHandler(error));
  }, [error, dispatch]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    console.log(formData.get("_id"));
    // try {
    //   const responseData = await sendRequest(
    //     `${process.env.REACT_APP_BASE_URL}/users/${userId}/create_exam`,
    //     "POST",
    //     {
    //       Authorization: "Bearer " + token,
    //       "Content-Type": "application/json",
    //     }
    //   );

    // } catch (error) {}
  };

  const getPostCodeHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const post_section = formData.get("post_section");
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BASE_URL}/admin/public/post_admin_data`,
        "POST",
        JSON.stringify({ post_section: post_section }),
        {
          "Content-Type": "application/json",
        }
      );
      const responseObject = response.data as unknown as Record<
        string,
        IPostAdminData[]
      >;
      const firstKey = Object.keys(responseObject)[0];
      const responseData = responseObject[firstKey] as IPostAdminData[];
      setSection(sectionMap[firstKey] || SectionState.default);
      setData(responseData);
    } catch (err) {}
  };

  let component;
  switch (section) {
    case SectionState.post_common:
      component = <PostCommonForm data={data} />;
      break;
    default:
      component = (
        <form onSubmit={getPostCodeHandler} className="flex gap-2">
          <Dropdown name="post_section" dropdownData={POST_SECTION} />
          <Button type="submit">Get Post Code</Button>
        </form>
      );
  }

  return component;
};

export default Create;
