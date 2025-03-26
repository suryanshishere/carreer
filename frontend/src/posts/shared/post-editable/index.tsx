import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "shared/store";
import { removeKeyValuePair, setKeyValuePair } from "shared/store/postSlice";
import { getFieldValidation, validateFieldValue } from "./post-editable-utils";
import InputField from "./InputField";
import ActionButtons from "./ActionButtons";
import { Input } from "shared/utils/form/Input";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

type Mode = "idle" | "editing" | "saved";

const PostEditable: React.FC<{
  keyProp: string;
  valueProp: string | number;
  genKey?: boolean;
}> = ({ keyProp, valueProp, genKey }) => {
  const dispatch = useDispatch<AppDispatch>();

  const initialInputValue = !genKey ? valueProp : "";
  const [state, setState] = useState<{
    mode: Mode;
    customKey: string;
    inputValue: string | number;
    isChanged: boolean;
  }>({
    mode: "idle", // no custom key active yet
    customKey: "",
    inputValue: initialInputValue,
    isChanged: false,
  });

  // effective key is the custom key if one exists (when genKey is true and a custom key is provided)
  const effectiveKey = genKey && state.customKey ? state.customKey : keyProp;
  const lastName = effectiveKey.split(".").pop() || "";
  const validationConfig = getFieldValidation(lastName);
  const inputType =
    typeof valueProp === "number"
      ? "number"
      : validationConfig?.type === "date"
      ? "date"
      : "text";

  const { isValid, error } = validateFieldValue(
    state.inputValue,
    validationConfig
  );

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
      isChanged: newValue.toString().length > 0,
    }));
  };

  const handleCustomKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, customKey: e.target.value }));
  };

  const handleAdd = () => {
    // when Add is clicked, switch mode to editing so the custom key input appears
    setState((prev) => ({ ...prev, mode: "editing" }));
  };

  const handleSave = () => {
    const parsedValue =
      typeof valueProp === "number"
        ? +state.inputValue
        : validationConfig?.type === "date"
        ? state.inputValue.toString()
        : state.inputValue.toString();

    dispatch(setKeyValuePair({ key: effectiveKey, value: parsedValue }));

    // if using dynamic key, move to saved mode so the custom key stays and a delete button appears
    if (genKey) {
      setState((prev) => ({
        ...prev,
        isChanged: false,
        mode: "saved",
      }));
    } else {
      setState((prev) => ({ ...prev, isChanged: false }));
    }
  };

  const handleUndo = () => {
    // reset input value to its initial value
    setState((prev) => ({
      ...prev,
      inputValue: typeof valueProp === "number" ? valueProp : "",
      isChanged: false,
      mode: "editing",
    }));
    dispatch(removeKeyValuePair(effectiveKey));
  };

  const handleDelete = () => {
    // delete the saved custom key/value and revert to idle so the add button reappears
    dispatch(removeKeyValuePair(effectiveKey));
    setState({
      mode: "idle",
      customKey: "",
      inputValue: initialInputValue,
      isChanged: false,
    });
  };

  return (
    <div className="w-full h-full my-1 flex flex-col gap-2">
      {genKey && state.mode === "idle" && (
        <button
          onClick={handleAdd}
          className="self-center flex gap-1 items-center outline p-1 my-3 rounded px-2 text-custom_gray outline-custom_gray"
        >
          <AddIcon /> Add New Information
        </button>
      )}

      {(state.mode === "editing" || state.mode === "saved" || !genKey) && (
        <div className="w-full flex gap-2 items-center">
           <div
    className={`flex flex-col medium_mobile:flex-row gap-2 ${
      (!genKey || (genKey && state.customKey)) ? "flex-1" : "flex-grow-0"
    }`}
  >
            {(state.mode === "editing" || state.mode === "saved") && (
              <Input
                name="customKey"
                label="Enter custom key name:"
                type="text"
                value={state.customKey}
                onChange={handleCustomKeyChange}
              />
            )}

            {(!genKey || (genKey && state.customKey)) && (
              <InputField
                keyProp={keyProp + "." + effectiveKey}
                valueProp={valueProp}
                inputValue={state.inputValue}
                inputType={inputType}
                isValid={isValid}
                error={error}
                handleInputChange={handleInputChange}
                validationConfig={validationConfig}
                lastName={lastName}
                className="self-end w-full"
              />
            )}
          </div>
          {state.mode === "saved" ||
            (state.mode === "editing" && (
              <button
                onClick={handleDelete}
                className="flex-shrink-0 self-end pb-2 text-custom_gray"
              >
                <DeleteOutlineIcon />
              </button>
            ))}
        </div>
      )}
      <ActionButtons
        isSaved={state.mode === "saved"}
        isChanged={state.isChanged}
        isValid={isValid}
        onSave={handleSave}
        onUndo={handleUndo}
      />
    </div>
  );
};

export default PostEditable;
