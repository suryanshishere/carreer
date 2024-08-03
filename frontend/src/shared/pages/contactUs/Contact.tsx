import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHttpClient } from "../../hooks/http-hook";
import Button from "../../components/form/Button";
import Modal from "../../components/uiElements/modal/Modal";
import Form from "./Form";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UIFormData from "shared/components/uiElements/uihelpers/UIFormData";
import "./Contact.css";

const ContactUsForm = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const { isLoading, error } = useHttpClient();

  const onFormDataChange = (data: { [key: string]: string }) => {
    console.log(data);
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

  return (
    <>
      <Form
        className="w-1/2"
        error={error ?? undefined}
        isLoading={isLoading}
        onFormDataChange={onFormDataChange}
      />

      {showModal && (
        <Modal
          header="Review your info and confirm for submission"
          onCloseBackdrop={onCloseModalHandler}
          className="z-50 flex flex-col fixed top-1/2 left-1/2 h-auto contact_modal w-50"
        >
          <UIFormData formData={formData} className="pt-2 pr-2 pl-4"/>

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
