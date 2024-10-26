import React, { ReactNode } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import "./Modal.css";

interface ModalProps {
  noBackDrop?: boolean;
  className?: string;
  contentClassName?: string;
  header?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  onCloseBackdrop?: () => void;
}

const Modal: React.FC<ModalProps> = (props) => {
  return (
    <div className={`rounded-xl z-50 ${props.className}`}>
      <div className="flex p-2 justify-center items-center">
        <div className="text-base text-center">
          {props.header}
        </div>
        {props.onClose && (
          <IconButton
            className="right-1 top-2"
            size="small"
            sx={{
              position: "absolute",
              marginRight: ".25rem",
              "&:hover": {
                cursor: "default !important",
              },
            }}
            onClick={props.onClose}
          >
            <CloseIcon />
          </IconButton>
        )}
      </div>
      {props.header && <hr className="mb-2" />}
      {props.children}
    </div>
  );
};

export default Modal;
