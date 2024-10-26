import React from "react";
import { Input } from "shared/utilComponents/form/input/Input";
import Button from "shared/utilComponents/form/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";
import "./AuthForm.css";

interface FormProps {
  forgotPasswordClicked?: () => void;
  forgotPassword?: boolean;
  onBack?: () => void;
  register?: any;
  errors?: any;
}

const AuthForm: React.FC<FormProps> = ({
  forgotPasswordClicked,
  forgotPassword,
  onBack,
  errors,
  register,
}) => {
  return (
    <>
      <Input
        type="email"
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
        placeholder="Email"
        classProp="text-xl"
      />
      {!forgotPassword && (
        <>
          <Input
            {...register("password")}
            type="password"
            error={!!errors.password}
            helperText={errors.password?.message}
            placeholder="Password"
            classProp="text-xl"
          />
          <div className="flex gap-2">
            <Button
              classProp=" border-custom-grey"
              type="button"
              onClick={forgotPasswordClicked}
            >
              Forgot Password?
            </Button>
            <Button classProp="border-custom-grey" type="submit">
              Authenticate
            </Button>
          </div>
        </>
      )}
      {forgotPassword && (
        <div className="flex gap-2">
          <IconButton onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>
          <Button classProp="border-custom-grey" type="submit">
            Send reset link
          </Button>
        </div>
      )}
    </>
  );
};

export default AuthForm;
