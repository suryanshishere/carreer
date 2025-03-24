import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "shared/store";
import { removeKeyValuePair, setKeyValuePair } from "shared/store/postSlice";
import { getFieldValidation, validateFieldValue } from "./post-editable-utils";
import InputField from "./InputField";
import ActionButtons from "./ActionButtons";

//TODO: to improve to have right date, right now no intial date is set
// const formatDateValue = (value: any): string => {
//   // const date = new Date(value);
//   return "";
// };

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
  //states change hooks
  const [inputValue, setInputValue] = useState<string | number>(
    initialInputValue
  );
  const [isChanged, setIsChanged] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(inputType === "date");
  
  const { isValid, error } = validateFieldValue(inputValue, validationConfig);

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
    setInputValue(newValue);
    setIsChanged(true);
    setIsSaved(false);
    if (isFirstRender) setIsFirstRender(false);
  };

  const handleSave = () => {
    const parsedValue =
      typeof valueProp === "number"
        ? +inputValue
        : validationConfig?.type === "date"
        ? inputValue.toString()
        : inputValue.toString();

    dispatch(setKeyValuePair({ key: keyProp, value: parsedValue }));
    setIsChanged(false);
    setIsSaved(true);
  };

  const handleUndo = () => {
    setInputValue(initialInputValue);
    dispatch(removeKeyValuePair(keyProp));
    setIsChanged(false);
    setIsSaved(false);
  };

  return (
    <div className="w-full h-full my-1 flex flex-col justify-center gap-2">
      <InputField
        keyProp={keyProp}
        valueProp={valueProp}
        inputValue={inputValue}
        inputType={inputType}
        isValid={isValid}
        error={error}
        handleInputChange={handleInputChange}
        validationConfig={validationConfig}
        lastName={lastName}
      />
      <ActionButtons
        isSaved={isSaved}
        isChanged={isChanged}
        isValid={isValid}
        onSave={handleSave}
        onUndo={handleUndo}
      />
    </div>
  );
};

export default PostEditable;
