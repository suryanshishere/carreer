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

type PostEditableProps = {
  keyProp: string;
  valueProp: string | number;
  genKey?: boolean;
  onSaved?: () => void;
  onRemove?: () => void;
};

const PostEditable: React.FC<PostEditableProps> = ({
  keyProp,
  valueProp,
  genKey,
  onSaved,
  onRemove,
}) => {
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
  const inputType = genKey
    ? "text"
    : typeof valueProp === "number"
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
    if (inputType === "number") {
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

    if (parsedValue === valueProp) {
      // If the value is the same as before, remove it instead of saving again
      handleDelete();
      return;
    }

    dispatch(
      setKeyValuePair({
        key: genKey
          ? `${keyProp}.${effectiveKey.replace(/\s+/g, "_").toLowerCase()}`
          : keyProp,
        value: parsedValue,
      })
    );

    setState((prev) => ({
      ...prev,
      isChanged: false,
      mode: "saved",
    }));

    // notify parent that this field has been saved
    if (onSaved) onSaved();
  };

  const handleUndo = () => {
    // reset input value to its initial value
    setState((prev) => ({
      ...prev,
      inputValue: valueProp,
      isChanged: false,
      mode: "editing",
    }));
    dispatch(removeKeyValuePair(effectiveKey));
  };

  const handleDelete = () => {
    if (state.mode !== "saved") {
      // If not yet saved, simply reset the field to its initial state
      setState({
        mode: "idle",
        customKey: "",
        inputValue: initialInputValue,
        isChanged: false,
      });
      // Also remove any potential value from redux store
      dispatch(removeKeyValuePair(effectiveKey));
    } else {
      // If already saved, remove from the parent's list
      dispatch(removeKeyValuePair(effectiveKey));
      setState({
        mode: "idle",
        customKey: "",
        inputValue: initialInputValue,
        isChanged: false,
      });
      if (onRemove) onRemove();
    }
  };

  return (
    <div
      className={`w-full h-full flex flex-col gap-2 ${
        genKey ? " my-2" : "my-1"
      }`}
    >
      {genKey && state.mode === "idle" && (
        <button
          onClick={handleAdd}
          className="self-end flex gap-1 items-center outline p-1 rounded px-2 text-custom_gray outline-custom_gray"
        >
          <AddIcon /> Add New Information
        </button>
      )}

      {(state.mode === "editing" || state.mode === "saved" || !genKey) && (
        <div className="w-full flex gap-2 items-center">
          <div
            className={`flex flex-col medium_mobile:flex-row medium_mobile:items-center gap-2 ${
              !genKey || (genKey && state.customKey) ? "flex-1" : "flex-grow-0"
            }`}
          >
            {(state.mode === "editing" || state.mode === "saved") && genKey && (
              <Input
                name="customKey"
                type="text"
                value={state.customKey}
                onChange={handleCustomKeyChange}
              />
            )}

            {(!genKey || (genKey && state.customKey)) && (
              <InputField
                keyProp={effectiveKey}
                valueProp={valueProp}
                inputValue={state.inputValue}
                inputType={inputType}
                isValid={isValid}
                error={error}
                handleInputChange={handleInputChange}
                validationConfig={validationConfig}
                lastName={lastName}
                className="w-full"
              />
            )}
          </div>
          {(state.mode === "saved" || state.mode === "editing") && genKey && (
            <button
              onClick={handleDelete}
              className="flex-shrink-0 text-custom_gray"
            >
              <DeleteOutlineIcon />
            </button>
          )}
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
