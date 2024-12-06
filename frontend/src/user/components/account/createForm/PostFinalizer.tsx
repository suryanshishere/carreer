import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form"; // Import useForm
import { yupResolver } from "@hookform/resolvers/yup"; // Import yupResolver
import * as Yup from "yup"; // Import Yup
import { useHttpClient } from "shared/hooks/http-hook";
import { useNavigate, useParams } from "react-router-dom";
import { IPostAdminData } from "models/admin/IPostAdminData";
import Button from "shared/utils/form/Button";
import  Dropdown  from "shared/utils/form/input/Dropdown";
import { undefinedFieldActions } from "shared/store/undefined-fields-slice";
import { startCase } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import { triggerErrorMsg } from "shared/store/thunks/response-thunk";

// Schema validation with Yup
const validationSchema = Yup.object().shape({
  post_id: Yup.string()
    .length(24, "Post ID must be exactly 24 characters long") // MongoDB Types.ObjectId length
    .required("Post ID is required"), // Required field
});

const PostFinalizer = () => {
  const { sendRequest } = useHttpClient();
    const { token } = useSelector(
    (state: RootState) => state.auth.userData
  );
  const [postIdData, setPostIdData] = useState<IPostAdminData[]>([]);
  const { post_section } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Initialize useForm from react-hook-form with validation schema
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema), // Add Yup resolver for validation
    mode: "onSubmit",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseCool = await sendRequest(
          `${process.env.REACT_APP_BASE_URL}/admin/public/${post_section}/post_admin_data`,
          "GET",
          null,
          {
            
            Authorisation: "Bearer " + token,
          }
        );

        const responseData = responseCool.data as unknown as {
          [key: string]: IPostAdminData[];
        };
        const firstKey = Object.keys(responseData)[0];
        const responseDataValue = responseData[firstKey] || [];
        if (responseDataValue.length === 0) {
          dispatch(triggerErrorMsg("No data found!"));
          navigate("/user/account/contribute_to_post");
        } else {
          setPostIdData(responseDataValue);
        }
      } catch (err) {}
    };
    fetchData();
  }, [post_section, sendRequest, token, navigate]);

  const submitHandler: SubmitHandler<{ post_id: string }> = async (data) => {
    const postId = data.post_id;

    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BASE_URL}/user/account/undefined_fields/${post_section}/${postId}`,
        "GET",
        null,
        {
          
          authorisation: "Bearer " + token,
        }
      );

      const responseData = response.data as unknown as {
        message: string;
        undefinedFields: string[];
      };

      dispatch(undefinedFieldActions.setFields(responseData.undefinedFields));
      console.log(responseData.undefinedFields);
      navigate(`${postId}`);
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="flex flex-col gap-2"
    >
      <h3>{startCase(`${post_section}`)}</h3>
      <Dropdown
        name="post_id"
        data={postIdData}
        required
        register={register} // Pass register to the Dropdown
        error={!!errors.post_id} // Pass error status
        helperText={errors.post_id?.message} // Pass error message
      />
      <Button type="submit">Select</Button>
    </form>
  );
};

export default PostFinalizer;
