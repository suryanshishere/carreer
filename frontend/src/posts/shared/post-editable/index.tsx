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
import { NON_REQUIRED_FIELD } from "posts/db/renders";

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

  // For normal fields (not genKey) the initial input value remains valueProp.
  const initialInputValue = !genKey
    ? valueProp === "Deleted"
      ? "Deleted!"
      : valueProp
    : "";
  const [state, setState] = useState<{
    mode: Mode;
    customKey: string;
    inputValue: string | number;
    isChanged: boolean;
  }>({
    mode: "idle",
    customKey: "",
    inputValue: initialInputValue,
    isChanged: false,
  });

  const isDyanmicKey = keyProp.includes("_1_") ? true : false;
  // effective key is the custom key if provided (when genKey is true), otherwise keyProp (checking dynamic key, since it's needed some processing)
  const lastName = keyProp.split(".").pop() || "";
  const effectiveKey =
    state.customKey && genKey
      ? `${keyProp}.${state.customKey.replace(/\s+/g, "_").toLowerCase()}`
      : isDyanmicKey
      ? lastName
      : keyProp;
  const validationConfig = getFieldValidation(lastName);
  const inputType = genKey
    ? "text"
    : typeof valueProp === "number"
    ? "number"
    : validationConfig?.type === "date"
    ? "date"
    : "text";

  const { isValid, error } = validateFieldValue(
    state.inputValue ?? "",
    validationConfig,
    { skipValidation: state.inputValue === "Deleted" }
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    let newValue: string | number = e.target.value;
    if (inputType === "number") {
      // Keep it as string if empty so that "" is not converted to 0.
      newValue = e.target.value === "" ? "" : +e.target.value;
    } else if (inputType === "date") {
      newValue = e.target.value;
    }

    // If the value hasn't changed
    if (
      (typeof valueProp === "string" && newValue === valueProp.trim()) ||
      valueProp === newValue
    ) {
      setState((prev) => ({
        ...prev,
        inputValue: newValue,
        isChanged: false,
      }));
      return;
    } else {
      setState((prev) => ({
        ...prev,
        inputValue: newValue,
        isChanged: newValue.toString().length > 0,
      }));
    }
  };

  const handleCustomKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, customKey: e.target.value }));
  };

  const handleAdd = () => {
    // When Add is clicked, switch mode to editing so the custom key input appears.
    setState((prev) => ({ ...prev, mode: "editing" }));
  };

  const handleSave = () => {
    // When the input shows deletion, save null.
    const parsedValue =
      inputType === "number" &&
      initialInputValue !== "Deleted" &&
      state.inputValue !== "Deleted"
        ? +state.inputValue!
        : validationConfig?.type === "date"
        ? state.inputValue!.toString()
        : state.inputValue!.toString();

    // If the value hasn't changed
    if (
      typeof initialInputValue === "string" &&
      parsedValue === initialInputValue.trim()
    ) {
      return;
    }

    dispatch(
      setKeyValuePair({
        key: effectiveKey,
        value: parsedValue,
      })
    );

    setState((prev) => ({
      ...prev,
      isChanged: false,
      mode: "saved",
    }));

    if (onSaved) onSaved();
  };

  const handleUndo = () => {
    // Reset input value to its initial value (which might be a valid number/string, not null)
    setState((prev) => ({
      ...prev,
      inputValue: initialInputValue,
      isChanged: false,
      mode: "editing",
    }));
    dispatch(removeKeyValuePair(effectiveKey));
  };

  const handleDelete = () => {
    if (!genKey) {
      // For normal fields, mark the key as deleted by setting inputValue to null.
      setState((prev) => ({
        ...prev,
        inputValue: "Deleted",
        isChanged: true,
        mode: "saved", // Mark as saved so that when Save is clicked, null is dispatched.
      }));
    } else {
      if (state.mode !== "saved") {
        setState({
          mode: "idle",
          customKey: "",
          inputValue: initialInputValue,
          isChanged: false,
        });
        dispatch(removeKeyValuePair(effectiveKey));
      } else {
        dispatch(removeKeyValuePair(effectiveKey));
        setState({
          mode: "idle",
          customKey: "",
          inputValue: initialInputValue,
          isChanged: false,
        });
        if (onRemove) onRemove();
      }
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
          className="self-end flex justify-center items-center outline p-1 rounded-full text-custom_gray outline-custom_less_gray"
        >
          <AddIcon />
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

            {state.inputValue === "Deleted" ? (
              <span className="text-custom_gray cursor-not-allowed">
                Deleted
              </span>
            ) : (
              (!genKey || (genKey && state.customKey)) && (
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
              )
            )}
          </div>
          {genKey ? (
            // For genKey fields, always show the delete button.
            <button
              onClick={handleDelete}
              className="flex-shrink-0 text-custom_gray"
            >
              <DeleteOutlineIcon />
            </button>
          ) : (
            (NON_REQUIRED_FIELD[keyProp] || isDyanmicKey) &&
            state.inputValue !== "Deleted" && (
              <button
                onClick={handleDelete}
                className="flex-shrink-0 text-custom_gray"
              >
                <DeleteOutlineIcon />
              </button>
            )
          )}
        </div>
      )}
      {(state.isChanged || state.mode === "saved") && (
        <ActionButtons
          isSaved={state.mode === "saved"}
          isChanged={state.isChanged}
          isValid={isValid}
          onSave={handleSave}
          onUndo={handleUndo}
        />
      )}
    </div>
  );
};

export default PostEditable;
