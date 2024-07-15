import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AdminExamProps } from "models/admin/AdminExamProps";
import  useAuth  from "shared/hooks/auth-hook";
import { useHttpClient } from "shared/hooks/http-hook";
import { responseUIAction } from "shared/store/reponse-ui-slice";

export const useAdminExamData = () => {
  const { sendRequest, error, isLoading } = useHttpClient();
  const [examData, setExamData] = useState<AdminExamProps>({
    exam_conducting_body: [],
    exam_code: [],
    exam_mode: [],
    exam_level: [],
    state_and_union: [],
    job_type: [],
    syllabus: [],
    category: [],
    eligibility__minimun_qualification: [],
    vacancy__gender_applicant: [],
  });
  const { userId } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(responseUIAction.setErrorHandler(error));
    dispatch(responseUIAction.isLoadingHandler(isLoading));
  }, [error, isLoading, dispatch]);

  useEffect(() => {
    let fetchExamData = () => {};

    fetchExamData = async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BASE_URL}/admin/public/admin_exam_data`,
          "GET",
          null,
          {
            userid: userId || "",
          }
        );
        const responseData: AdminExamProps =
          response.data as unknown as AdminExamProps;
        setExamData(responseData);
      } catch (err) {}
    };

    fetchExamData();
  }, [sendRequest, userId]);

  return examData;
};
