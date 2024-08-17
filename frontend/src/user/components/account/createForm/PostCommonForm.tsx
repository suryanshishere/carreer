import { IPostAdminData } from "models/admin/IPostAdminData";
import React, { useState } from "react";
import POST_COMMON_FORM from "db/userDb/createDb/postCommonFormDb.json";
import { renderFormFields, structureFormData } from "./helper";
import Button from "shared/utilComponents/form/Button";

interface PostCommonFormProps {
  data: IPostAdminData[];
}

const PostCommonForm: React.FC<PostCommonFormProps> = ({ data }) => {
  const [dynamicFormData, setDynamicFormData] = useState<Record<string, any>>({});

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const formValues: Record<string, any> = {};

    formData.forEach((value, key) => {
      if (formValues[key]) {
        if (Array.isArray(formValues[key])) {
          formValues[key].push(value);
        } else {
          formValues[key] = [formValues[key], value];
        }
      } else {
        formValues[key] = value;
      }
    });

    const structuredData = structureFormData(formValues, POST_COMMON_FORM);

    // Merge the dynamic form data with the structured data
    const finalStructuredData = {
      ...structuredData,
      ...dynamicFormData
    };

    console.log(finalStructuredData);
  };

  const handleDynamicFormData = (data: Record<string, any>) => {
    setDynamicFormData(data);
  };

  return (
    <form onSubmit={submitHandler} className="flex flex-col gap-2">
      <h2>Post Common Section</h2>
      {renderFormFields(POST_COMMON_FORM, data, handleDynamicFormData)}
      <Button>Submit</Button>
    </form>
  );
};

export default PostCommonForm;
