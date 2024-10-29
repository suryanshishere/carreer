import { IPostDetail } from "models/post/IPostDetail";
import DetailItem from "post/components/DetailItem";
import DetailItemHeader from "post/components/DetailItemHeader";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useHttpClient } from "shared/utilComponents/hooks/http-hook";
import useUserData from "shared/utilComponents/hooks/user-data-hook";

const EditPostItem = () => {
  const { post_section, post_id } = useParams();
  const { sendRequest } = useHttpClient();
  const [data, setData] = useState<IPostDetail | null>(null);
  const navigate = useNavigate();
  const { userId, token } = useUserData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BASE_URL}/admin/private/edit_post/${post_section}/${post_id}`,
          "GET",
          null,
          {
            userid: userId || "",
            Authorization: "Bearer " + token,
          }
        );

        const responseData = response.data as IPostDetail;
        if (responseData) {
          setData(responseData);
        } else {
          navigate(-1);
        }
      } catch (err) {}
    };

    fetchData();
  }, [post_section, post_id]);

  if (!data) {
    return null;
  }

  return (
    <div className="detail_page_sec flex flex-col items-center">
      <DetailItemHeader />
      {data && <DetailItem detailPageData={data} />}
    </div>
  );
};

export default EditPostItem;
