import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useHttpClient } from "../../hooks/http-hook";
import Button from "../../components/form/Button";
import Modal from "../../components/uiElements/modal/Modal";
import Form from "./Form";
import "./Contact.css";

const ContactUsForm = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const { isLoading, error } = useHttpClient();

  const onFormDataChange = (data: { [key: string]: string }) => {
    console.log(data)
    setFormData(data);
    setShowModal(true); // Receive formData from Form component
  };

  const okayModalHandler = async () => {
    setShowModal(false);
    try {
      console.log(formData);
      navigate("/");
    } catch (err) {}
  };

  const onCancelModalHandler = () => {
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
          backdropShow={showModal}
          onCancel={onCancelModalHandler}
          onCancelBackdrop={onCancelModalHandler}
          footer={<Button onClick={okayModalHandler}>Confirm</Button>}
        >
          {formData && Object.keys(formData).length > 0 && (
            <div className="modal_para w-full pt-2 flex flex-col flex-wrap gap-2">
              {Object.entries(formData).map(([key, value]) => (
                <li className="flex items-center list-none">
                  <h6 className="self-start m-0 pt-1 capitalize">{key}:</h6>
                  <p className="m-0 font-bold">
                    {Array.isArray(value)
                      ? (value as string[]).join(", ")
                      : value}
                  </p>
                </li>
              ))}
            </div>
          )}
        </Modal>
      )}
    </>
  );
};

export default ContactUsForm;
