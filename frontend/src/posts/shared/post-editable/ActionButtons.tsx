import React from "react";
import Button from "shared/utils/form/Button";

interface ActionButtonsProps {
  isSaved: boolean;
  isChanged: boolean;
  isValid: boolean;
  onSave: () => void;
  onUndo: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isSaved,
  isChanged,
  isValid,
  onSave,
  onUndo,
}) => {
  return (
    <>
      {(isSaved || isChanged) && (
        <Button
          onClick={onUndo}
          className="py-2 bg-custom_white font-medium transform ease-linear duration-200"
        >
          Undo
        </Button>
      )}

      {isChanged && (
        <Button
          contributeSaveButton
          onClick={() => {
            if (isValid) onSave();
          }}
          disabled={!isValid}
          className={`flex-1 px-2 py-2 rounded transform ease-linear duration-200 ${
            isValid
              ? "bg-custom_blue text-custom_white hover:bg-custom_dark_blue"
              : "bg-custom_less_gray text-custom_gray cursor-not-allowed"
          }`}
        >
          Save
        </Button>
      )}
    </>
  );
};

export default ActionButtons;
