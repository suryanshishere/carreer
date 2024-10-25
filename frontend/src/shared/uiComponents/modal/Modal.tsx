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
    <div className={`${props.className}`}>
      <div className="border-2 flex p-2 justify-center items-center">
        <header className=" text-center m-0 font-bold">{props.header}</header>
        {props.onClose && (
          <IconButton
            className="right-0"
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
      {props.header && <hr />}
      {props.children}
    </div>
  );
};

export default Modal;
