import React from "react";
import { Input } from "shared/utilComponents/form/input/Input";
import Button from "shared/utilComponents/form/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";
import "./AuthForm.css";

interface FormProps {
  inputOuterClassProp?: string;
  inputErrorClassProp?: string;
  inputClassProp?: string;
  buttonClassProp?: string;
  forgotPassword?: boolean;
  onBack?: () => void;
  register?: any;
  errors?: any;
  pendingProp?: boolean;
}

const AuthForm: React.FC<FormProps> = ({
  inputErrorClassProp,
  inputOuterClassProp,
  inputClassProp,
  buttonClassProp,
  forgotPassword,
  onBack,
  errors,
  register,
  pendingProp = false,
}) => {
  return (
    <>
      <Input
        type="email"
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
        placeholder="Email"
        classProp={`${inputClassProp}`}
        outerClassProp={`${inputOuterClassProp}`}
      />
      {!forgotPassword ? (
        <>
          <Input
            {...register("password")}
            type="password"
            error={!!errors.password}
            helperText={errors.password?.message}
            placeholder="Password / Create new password"
            classProp={`${inputClassProp}`}
            errorClassProp={`${inputErrorClassProp}`}
            outerClassProp={`${inputOuterClassProp}`}
          />
          <Button classProp={`${buttonClassProp}`} type="submit">
            {pendingProp ? "Authenticating..." : "Authenticate"}
          </Button>
        </>
      ) : (
        <>
          {onBack && (
            <IconButton onClick={onBack}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Button classProp={`${buttonClassProp}`} type="submit">
            {pendingProp
              ? "Sending reset password link.."
              : "Send reset password link"}
          </Button>
        </>
      )}
    </>
  );
};

export default AuthForm;
