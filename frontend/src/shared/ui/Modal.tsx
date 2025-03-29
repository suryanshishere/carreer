import React, { ReactNode } from "react";
import ReactDOM from "react-dom";
import Button from "shared/utils/form/Button";
import CloseIcon from "@mui/icons-material/Close";

interface ModalProps {
  header: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose?: () => void;
  onCancel?: (() => void) | boolean;
  confirmButton?: ReactNode;
  childrenClassName?: string; // Added this
}

const Modal: React.FC<ModalProps> = ({
  header,
  children,
  footer,
  onClose,
  onCancel,
  confirmButton,
  childrenClassName, // Destructure the new prop
}) => {
  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <div className="fixed page_padding inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-custom_white rounded shadow-lg mobile:max-w-2xl min-w-full mobile:min-w-96 p-2 relative flex flex-col gap-1">
        {/* Close Icon */}
        {onClose && (
          <Button
            iconButton
            onClick={onClose}
            className="absolute top-2 right-2"
          >
            <CloseIcon />
          </Button>
        )}

        {/* Header */}
        <div className="h-8 flex items-center justify-center">
          <h2>{header}</h2>
        </div>
        <hr />

        {/* Content */}
        <div
          className={`overflow-auto min-h-12 max-h-60 flex flex-col items-center p-2 gap-1 bg-custom_pale_yellow ${
            childrenClassName || ""
          }`}
        >
          {children}
        </div>

        {/* Footer */}
        {footer ? (
          footer
        ) : confirmButton ? (
          <div className="flex justify-between gap-2">
            {onCancel && (
              <Button
                onClick={typeof onCancel !== "boolean" ? onCancel : onClose}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
            {confirmButton}
          </div>
        ) : null}
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
