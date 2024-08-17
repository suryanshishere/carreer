import React from "react";
import Button from "shared/utilComponents/form/Button";
import CreateFormOther, {
  AgeCriteria,
  ApplicationFormFee,
  Eligibility,
  ImportantDates,
  ImportantLinks,
  Vacancy,
} from "./Custom";
// import { convertJson } from "src/shared/components/utils/ConvertJson";
import  DirectForm  from "./Direct";

interface CreateFormProps {
  onSubmit: (data: any) => void;
}

const CreateForm: React.FC<CreateFormProps> = ({ onSubmit }) => {
  // const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   const form = event.currentTarget;
  //   const formData = new FormData(form);

  //   // Convert FormData to an object
  //   const data: { [key: string]: any } = {};
  //   formData.forEach((value, key) => {
  //     data[key] = value;
  //   });

  //   // const convertedJson = convertJson(data)
  //   onSubmit(convertedJson)
  //   // console.log(convertedJson);
  // };

  return (
    <form className="flex flex-col gap-3">
      <DirectForm />
      <Button className="self-end pt-2 pb-2 pl-3 pr-3">Publish</Button>
    </form>
  );
};

export default CreateForm;
