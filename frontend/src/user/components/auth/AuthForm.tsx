import React, { ReactNode, useState } from "react";
import { Input } from "shared/utilComponents/form/input/Input";
import Button from "shared/utilComponents/form/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";
import "./AuthForm.css";

export interface FormState {
  email: {
    value: string;
    isValid: boolean;
  };
  password: {
    value: string;
    isValid: boolean;
  };
  newPassword?: {
    value: string;
    isValid: boolean;
  };
  name?: {
    value: string;
    isValid: boolean;
  };
  isLoginMode?: boolean;
  userId?: {
    value: string;
    isValid: boolean;
  };
}

export type FormSubmitHandler = (formState: FormState) => void;

interface FormProps {
  onFormSubmit: FormSubmitHandler;
  forgotPasswordClicked?: () => void;
  resetPasswordClicked?: () => void;
  signupClicked?: () => void;
  forgotPassword?: boolean;
  resetPassword?: boolean;
  otp?: boolean;
  onBack?: () => void;
  onBackLogin?: () => void;
  changePassword?: boolean;
}

const Form: React.FC<FormProps> = ({
  onFormSubmit,
  forgotPasswordClicked,
  forgotPassword,
  resetPassword,
  onBack,
  onBackLogin,
}) => {
  const [formState, setFormState] = useState<FormState>({
    email: {
      value: "",
      isValid: false,
    },
    password: {
      value: "",
      isValid: false,
    },
    newPassword: {
      value: "",
      isValid: false,
    },
    userId: {
      value: "",
      isValid: false,
    },
    isLoginMode: true,
  });

  const switchModeHandler = () => {
    setFormState((prevState) => ({
      ...prevState,
      isLoginMode: !prevState.isLoginMode,
      name: prevState.isLoginMode ? undefined : { value: "", isValid: false },
      image: prevState.isLoginMode
        ? undefined
        : { value: null, isValid: false },
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: {
        value: value,
        isValid: true,
      },
    }));
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    onFormSubmit(formState);
  };

  let backButton: ReactNode = (
    <>
      <IconButton onClick={onBackLogin || onBack}>
        <ArrowBackIcon />
      </IconButton>
    </>
  );

  return (
    <form
      className="auth_form w-full flex flex-col gap-3"
      onSubmit={submitHandler}
    >
      {!formState.isLoginMode && !forgotPassword && (
        <Input
          type="text"
          name="name"
          placeholder="Your name"
          value={formState.name?.value || ""}
          onChange={handleInputChange}
          required
        />
      )}

      <Input
        type="email"
        name="email"
        placeholder="Your email id"
        value={formState.email?.value || ""}
        onChange={handleInputChange}
        required
      />

      {!forgotPassword && (
        <Input
          name="password"
          type="password"
          placeholder={resetPassword ? "Your new password" : "Your password"}
          value={formState.password.value}
          onChange={handleInputChange}
          required
        />
      )}
      <div className="auth_form_button w-full flex justify-between items-center">
        {forgotPassword && (
          <div>
            {backButton} <Button>Send reset link</Button>
          </div>
        )}

        {!forgotPassword && (
          <>
            <Button
              noOutline
              className="ml-2 forgotPasswordReset"
              type="button"
              onClick={forgotPasswordClicked}
            >
              Forgot Password?
            </Button>
            <div>
              <Button type="button" onClick={switchModeHandler}>
                SWITCH TO {formState.isLoginMode ? "SIGNUP" : "LOGIN"}
              </Button>
              <Button>{formState.isLoginMode ? "LOGIN" : "SIGNUP"}</Button>
            </div>
          </>
        )}
      </div>
    </form>
  );
};

export default Form;
