import React, { useState } from "react";
import { Input } from "src/shared/components/form/input/Input";
import Button from "src/shared/components/form/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./Form.css";

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
  image?: {
    value: File | null;
    isValid: boolean;
  };
  isLoginMode?: boolean;
  userId?: {
    value: string;
    isValid: boolean;
  };
  otp?: {
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
  resetPasswordClicked,
  forgotPassword,
  resetPassword,
  otp,
  onBack,
  onBackLogin,
  changePassword,
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
    otp: {
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

  return (
    <form className="auth_form w-full flex flex-col gap-3" onSubmit={submitHandler}>
      {!formState.isLoginMode && !forgotPassword && !resetPassword && !otp && (
        <Input
          type="text"
          name="name"
          placeholder="Your name"
          value={formState.name?.value || ""}
          onChange={handleInputChange}
          required
        />
      )}
      {!otp && (
        <Input
          type="email"
          name="email"
          placeholder="Your email id"
          value={formState.email?.value || ""}
          onChange={handleInputChange}
          required
        />
      )}
      {(resetPassword || otp) && (
        <Input
          type="text"
          name="otp"
          placeholder="Your OTP"
          value={formState.otp?.value || ""}
          onChange={handleInputChange}
          required
        />
      )}
      {(!forgotPassword || resetPassword || changePassword) && !otp && (
        <Input
          togglePassword
          name="password"
          placeholder={resetPassword ? "Your new password" : "Your password"}
          value={formState.password.value}
          onChange={handleInputChange}
          required
        />
      )}
      {changePassword && (
        <Input
          togglePassword
          name="newPassword"
          placeholder="New Password"
          onChange={handleInputChange}
          required
        />
      )}
      <div className="auth_form_button w-full flex justify-between items-center">
        {resetPassword && (
          <div>
            <div className="circle_icon" onClick={onBack}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </div>
            <Button onClick={resetPasswordClicked}> Reset Password</Button>
          </div>
        )}

        {changePassword && !resetPassword && (
          <div>
            <Button>Confirm password change</Button>
          </div>
        )}

        {((forgotPassword && !changePassword) || otp) && (
          <>
            <div>
              <div className="circle_icon" onClick={onBackLogin || onBack}>
                <FontAwesomeIcon icon={faArrowLeft} />
              </div>
              <Button>
                {changePassword
                  ? "Confirm password change"
                  : otp
                  ? "Confirm OTP"
                  : "Send OTP"}
              </Button>
            </div>
          </>
        )}

        {!forgotPassword && !changePassword && !otp && !resetPassword && (
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
