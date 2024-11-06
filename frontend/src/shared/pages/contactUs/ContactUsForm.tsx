import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useHttpClient } from "shared/utilComponents/hooks/http-hook";
import Button from "shared/utilComponents/form/Button";
import Modal from "shared/uiComponents/modal/Modal";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UIFormData from "shared/uiComponents/uiUtilComponents/UIFormData";
import { Input, TextArea } from "shared/utilComponents/form/input/Input";
import "./ContactUsForm.css";

interface ContactUsFormProps {
  className?: string;
  footerClassNames?: string;
  error?: string;
  isLoading?: boolean;
  onFormDataChange: (formData: { [key: string]: string }) => void;
}

const ContactUsForm: React.FC = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const { isLoading, error } = useHttpClient();

  const onFormDataChange = (data: { [key: string]: string }) => {
    setFormData(data);
    setShowModal(true);
  };

  const okayModalHandler = async () => {
    setShowModal(false);
    try {
      console.log(formData);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const onCloseModalHandler = () => {
    setShowModal(false);
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
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
    <>
      <form className={` form_sec`} onSubmit={submitHandler}>
        <Input type="text" name="name" placeholder="Your name" required />
        <Input type="email" name="email" placeholder="Your email id" required />
        <TextArea
          name="reason"
          placeholder="Reason for which you are contacting us"
          row={6}
          required
        />
        <div className={`form_error_submit`}>
          {error && <div className="basic-error-info">{error}</div>}
          <Button type="submit" outline >{isLoading ? "loading icon" : "Submit"}</Button>
        </div>
      </form>

      {showModal && (
        <Modal
          header="Review your info and confirm for submission"
          onCloseBackdrop={onCloseModalHandler}
          className="z-50 flex flex-col fixed top-1/2 left-1/2 h-auto contact_modal w-50"
        >
          <UIFormData formData={formData} className="pt-2 pr-2 pl-4" />

          <div className="p-1 flex justify-end items-center gap-2 self-end">
            <IconButton onClick={onCloseModalHandler}>
              <ArrowBackIcon />
            </IconButton>
            <Button onClick={okayModalHandler}>Confirm</Button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ContactUsForm;
