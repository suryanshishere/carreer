import React from "react";
import { Input } from "shared/utilComponents/form/input/Input";
import Button from "shared/utilComponents/form/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";
import "./AuthForm.css";

interface FormProps {
  inputOuterClassProp?: string;
  inputClassProp?: string;
  buttonClassProp?: string;
  forgotPassword?: boolean;
  onBack?: () => void;
  register?: any;
  errors?: any;
}

const AuthForm: React.FC<FormProps> = ({
  inputOuterClassProp,
  inputClassProp,
  buttonClassProp,
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
            outerClassProp={`${inputOuterClassProp}`}
          />
          <Button
            classProp={` ${buttonClassProp}`}
            type="submit"
          >
            Authenticate
          </Button>
        </>
      ) : (
        <div className="flex gap-2">
          <IconButton onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>
          <Button
            classProp={`${buttonClassProp}`}
            type="submit"
          >
            Send reset link
          </Button>
        </div>
      )}
    </>
  );
};

export default AuthForm;
