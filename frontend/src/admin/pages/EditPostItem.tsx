import { IPostDetail } from "models/postModels/IPostDetail";
import DetailItem from "post/components/postDetailItem/PostDetailItem";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useHttpClient } from "shared/hooks/http-hook";
import { RootState } from "shared/store";

const EditPostItem = () => {
  const { post_section, post_id } = useParams();
  const { sendRequest } = useHttpClient();
  const [data, setData] = useState<IPostDetail | null>(null);
  const navigate = useNavigate();
  const { token } = useSelector(
    (state: RootState) => state.auth.userData
  );

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await sendRequest(
  //         `${process.env.REACT_APP_BASE_URL}/admin/private/edit_post/${post_section}/${post_id}`,
  //         "GET",
  //         null,
  //         {
  //           Authorization: "Bearer " + token,
  //         }
  //       );

  //       const responseData = response.data as IPostDetail;
  //       if (responseData) {
  //         setData(responseData);
  //       } else {
  //         navigate(-1);
  //       }
  //     } catch (err) {}
  //   };

  //   fetchData();
  // }, [post_section, post_id]);

  if (!data) {
    return null;
  }

  return (
    <div className="detail_page_sec flex flex-col items-center">
      {/* <DetailItemHeader /> */}
      {/* {data && <DetailItem detailPageData={data} />} */}
    </div>
  );
};

export default EditPostItem;
