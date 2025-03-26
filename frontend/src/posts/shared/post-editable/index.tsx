import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "shared/store";
import { removeKeyValuePair, setKeyValuePair } from "shared/store/postSlice";
import { getFieldValidation, validateFieldValue } from "./post-editable-utils";
import InputField from "./InputField";
import ActionButtons from "./ActionButtons";

const PostEditable: React.FC<{
  keyProp: string;
  valueProp: string | number;
  genKey?: boolean;
}> = ({ keyProp, valueProp }) => {
  const dispatch = useDispatch<AppDispatch>();
  const lastName = keyProp.split(".").pop() || "";
  const validationConfig = getFieldValidation(lastName);

  const inputType =
    typeof valueProp === "number"
      ? "number"
      : validationConfig?.type === "date"
      ? "date"
      : "text";

  const initialInputValue = inputType === "date" ? "" : valueProp;

  const [state, setState] = useState({
    inputValue: initialInputValue as string | number,
    isChanged: false,
    isSaved: false,
    isFirstRender: inputType === "date",
  });

  const { isValid, error } = validateFieldValue(state.inputValue, validationConfig);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    let newValue: string | number = e.target.value;
    if (typeof valueProp === "number") {
      newValue = +e.target.value;
    } else if (inputType === "date") {
      newValue = e.target.value;
    }
    setState((prev) => ({
      ...prev,
      inputValue: newValue,
      isChanged: true,
      isSaved: false,
      isFirstRender: false,
    }));
  };

  const handleSave = () => {
    const parsedValue =
      typeof valueProp === "number"
        ? +state.inputValue
        : validationConfig?.type === "date"
        ? state.inputValue.toString()
        : state.inputValue.toString();

    dispatch(setKeyValuePair({ key: keyProp, value: parsedValue }));
    setState((prev) => ({ ...prev, isChanged: false, isSaved: true }));
  };

  const handleUndo = () => {
    setState({
      inputValue: initialInputValue,
      isChanged: false,
      isSaved: false,
      isFirstRender: inputType === "date",
    });
    dispatch(removeKeyValuePair(keyProp));
  };

  return (
    <div className="w-full h-full my-1 flex flex-col justify-center gap-2">
      <InputField
        keyProp={keyProp}
        valueProp={valueProp}
        inputValue={state.inputValue}
        inputType={inputType}
        isValid={isValid}
        error={error}
        handleInputChange={handleInputChange}
        validationConfig={validationConfig}
        lastName={lastName}
      />
      <ActionButtons
        isSaved={state.isSaved}
        isChanged={state.isChanged}
        isValid={isValid}
        onSave={handleSave}
        onUndo={handleUndo}
      />
    </div>
  );
};

export default PostEditable;
