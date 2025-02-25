import React, { ReactNode, useRef } from "react";
import ReactDOM from "react-dom";
import Button from "shared/utils/form/Button";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "shared/store";
import useOutsideClick from "shared/hooks/outside-click-hook";
import { closeModal } from "shared/store/modal-slice";

interface ModalProps {
  header: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose?: boolean;
}

const Modal: React.FC<ModalProps> = ({ header, children, footer, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const isModalOpen = useSelector((state: RootState) => state.modal.isOpen);

  // Close modal on outside click
  useOutsideClick(modalRef, () => {
    if (isModalOpen && onClose) dispatch(closeModal());
  });

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot || !isModalOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="bg-white rounded shadow-lg w-full max-w-lg p-2 relative flex flex-col gap-2"
      >
        {/* Close Icon */}
        {onClose && (
          <Button
            iconButton
            onClick={() => dispatch(closeModal())}
            classProp="absolute top-2 right-2"
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
        <div className="h-20 flex flex-col justify-center items-start gap-1">
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
