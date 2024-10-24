import React, { useEffect, useState } from "react";
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
} from "db/userDb/contributeToPostDb/sectionFormsDb";
import { IPostAdminData } from "models/admin/IPostAdminData";
import { useHttpClient } from "shared/utilComponents/hooks/http-hook";
import { useNavigate, useParams } from "react-router-dom";
import useUserData from "shared/utilComponents/localStorageConfig/use-userData-hook";
import renderFormFields from "./createFormHelper/render-form-fields";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "shared/utilComponents/store";
import { undefinedFieldActions } from "shared/utilComponents/store/undefined-fields";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { removeEmptyFields } from "./createFormHelper/structure-json";
import _ from "lodash";
import { dataStatusUIAction } from "shared/utilComponents/store/data-status-ui";

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

//TODO: If the link is directly pasted, it's should be able to make up the form anyhow (hint: combining the postfinalizer and postsectionfrom into one)

const PostSectionForm: React.FC = () => {
  const { post_section, post_id } = useParams();
  const { userId, token } = useUserData();
  const navigate = useNavigate();
  const { sendRequest, error } = useHttpClient();
  const [tableFormData, setTableFormData] = useState<ITableFormData[]>([]);

  const dispatch = useDispatch();
  const { fields, postFormData } = useSelector(
    (state: RootState) => state.undefinedFields
  );

  const createValidationSchema = (postFormData: IContributeInputForm[]) => {
    const schemaFields: Record<string, Yup.AnySchema> = {};

    postFormData.forEach((field) => {
      let validation: Yup.AnySchema;

      // Determine the type of validation based on the field type
      switch (field.type) {
        case "text":
        case "textarea":
          validation = Yup.string()
            .transform((value, originalValue) => {
              return originalValue === "" ? undefined : value;
            })
            .nullable();

          if (field.validation?.minLength) {
            validation = (validation as Yup.StringSchema).min(
              field.validation.minLength,
              `${field.name} must be at least ${field.validation.minLength} characters`
            );
          }
          if (field.validation?.maxLength) {
            validation = (validation as Yup.StringSchema).max(
              field.validation.maxLength,
              `${field.name} must be at most ${field.validation.maxLength} characters`
            );
          }
          if (field.validation?.minWords !== undefined) {
            validation = (validation as Yup.StringSchema).test(
              "minWords",
              ({ value }) => {
                const wordCount = value ? value.trim().split(/\s+/).length : 0;
                return `${field.name} must be at least ${field.validation?.minWords} words (currently ${wordCount} words)`;
              },
              (value) =>
                !value ||
                value.trim().split(/\s+/).length >=
                  (field.validation?.minWords ?? 0)
            );
          }

          if (field.validation?.maxWords !== undefined) {
            validation = (validation as Yup.StringSchema).test(
              "maxWords",
              ({ value }) => {
                const wordCount = value ? value.trim().split(/\s+/).length : 0;
                return `${field.name} must be at most ${field.validation?.maxWords} words (currently ${wordCount} words)`;
              },
              (value) =>
                !value ||
                value.trim().split(/\s+/).length <=
                  (field.validation?.maxWords ?? Infinity)
            );
          }

          break;

        case "number":
          validation = Yup.number()
            .transform((value, originalValue) => {
              return originalValue === "" ? undefined : value;
            })
            .nullable();

          if (field.validation?.min) {
            validation = (validation as Yup.NumberSchema).min(
              field.validation.min,
              `${field.name} must be at least ${field.validation.min}`
            );
          }
          if (field.validation?.max) {
            validation = (validation as Yup.NumberSchema).max(
              field.validation.max,
              `${field.name} must be at most ${field.validation.max}`
            );
          }
          break;

        case "object":
          const subItemSchema = createValidationSchema(field.subItem || []);
          validation = Yup.object().shape(subItemSchema);
          // if (field.validation?.required) {
          //   validation = validation.required(`${field.name} is required`);
          // }
          break;

        case "array":
          const arraySchema = Yup.object().shape(
            createValidationSchema(field.subItem || [])
          );
          validation = Yup.array().of(arraySchema);
          // if (field.validation?.required) {
          //   validation = validation.required(`${field.name} is required`);
          // }
          break;

        default:
          validation = Yup.mixed().nullable();
      }

      // Add the validation rule to the schema
      schemaFields[field.name] = validation;
    });

    // Create and return the Yup validation schema as an object shape
    return schemaFields;
  };

  // Hydrate the Redux state from localStorage on component mount
  useEffect(() => {
    dispatch(undefinedFieldActions.restoreState());
    dispatch(dataStatusUIAction.setErrorHandler(error));
  }, []);

  useEffect(() => {
    if (post_section) {
      const newFormMap = formMap[post_section];
      if (newFormMap && !_.isEmpty(fields)) {
        const selectedForm = _.filter(newFormMap, (formField) =>
          _.includes(fields, formField.name)
        );
        dispatch(undefinedFieldActions.setPostformData(selectedForm));
      }
    }
  }, [post_section, fields, dispatch]);

  const validationSchema = Yup.object().shape(
    createValidationSchema(postFormData)
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onSubmit",
  });

  const submitHandler: SubmitHandler<any> = async (data) => {
    //TODO: TABLE DATA ADDING TO THE FINALDATA LEFT

    const mergedTableData: Record<string, any> = {};

    tableFormData.forEach((item) => {
      Object.entries(item).forEach(([key, value]) => {
        // Check if the key already exists in mergedTableData
        if (mergedTableData[key]) {
          // If it exists, ensure it's an array and push the new value
          if (Array.isArray(mergedTableData[key])) {
            mergedTableData[key].push(value);
          } else {
            mergedTableData[key] = [mergedTableData[key], value];
          }
        } else {
          mergedTableData[key] = value;
        }
      });
    });

    // Final structured data now contains merged table data
    const finalStructuredData = {
      ...data,
      ...mergedTableData,
    };

    const finalData = removeEmptyFields(finalStructuredData);
    console.log("Data sent", finalData);

    try {
      if (!post_id && !post_section) {
        return;
      } else if (Object.keys(finalData).length === 0) {
        dispatch(dataStatusUIAction.setErrorHandler("No data entered!"));
        return;
      }

      const response = await sendRequest(
        `${process.env.REACT_APP_BASE_URL}/user/account/contribute_to_post`,
        "POST",
        JSON.stringify({ post_id, post_section, data: finalData }),
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
      dispatch(undefinedFieldActions.clearFormData());
      dispatch(dataStatusUIAction.setResMsg(`${responseData.message}`));
      // navigate(-1); // Uncomment to navigate back after submission
    } catch (err) {}
  };

  // Handle table form data updates
  const handleTableInputData = (data: Record<string, any>) => {
    setTableFormData((prev) => [...prev, data]);
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="flex flex-col gap-2"
    >
      {renderFormFields(postFormData, handleTableInputData, register, errors)}
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default PostSectionForm;
