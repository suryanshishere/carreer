import React, { ReactNode } from "react";
import ReactDOM from "react-dom";
import Button from "shared/utils/form/Button";
import CloseIcon from "@mui/icons-material/Close"; 

interface ModalProps {
  header: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose?: () => void;
}

const Modal: React.FC<ModalProps> = ({ header, children, footer, onClose }) => {
  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <div className="fixed page_padding inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        // ref={modalRef}
        className="bg-white rounded shadow-lg w-full max-w-lg p-2 relative flex flex-col gap-2"
      >
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
        <div className="min-h- max-h-52 flex flex-col justify-center items-center gap-1">
          {children}
        </div>

        {/* Footer */}
        {footer && <div>{footer}</div>}
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
