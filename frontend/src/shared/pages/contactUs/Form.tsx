import React, { FormEvent } from "react";
import Button from "shared/components/form/Button";
import { Input, TextArea } from "shared/components/form/input/Input";
import "./Form.css";

interface FormProps {
  className?: string;
  footerClassNames?: string;
  error?: string;
  isLoading?: boolean;
  onFormDataChange: (formData: { [key: string]: string }) => void;
}

const Form: React.FC<FormProps> = ({
  isLoading,
  error,
  className,
  footerClassNames,
  onFormDataChange,
}) => {
  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fd = new FormData(e.currentTarget); // Change e.target to e.currentTarget
    const data = Object.fromEntries(fd.entries());

    const formattedData = {
      name: data.name as string,
      email: data.email as string,
      reason: data.reason as string,
    };

    onFormDataChange(formattedData);
  };

  return (
    <form className={`${className} form_sec`} onSubmit={submitHandler}>
      <Input
        type="text"
        name="name"
        placeholder="Your name"
        required
      />
      <Input
        type="email"
        name="email"
        placeholder="Your email id"
        required
      />
      <TextArea
        name="reason"
        placeholder="Reason for which you are contacting us"
        row={6}
        required
      />
      <div className={`${footerClassNames} form_error_submit`}>
        {error && <div className="basic-error-info">{error}</div>}
        <Button type="submit">{isLoading ? "loading icon" : "Submit"}</Button>
      </div>
    </form>
  );
};

export default Form;
