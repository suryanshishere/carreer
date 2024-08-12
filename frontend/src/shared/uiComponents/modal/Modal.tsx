import React, { ReactNode } from "react";
import ReactDOM from "react-dom";
import Backdrop from "./Backdrop";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import "./Modal.css";

interface ModalProps {
  noBackDrop?: boolean;
  className?: string;
  contentClassName?: string;
  header?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onClose?: () => void;
  onCloseBackdrop?: () => void;
}

const Modal: React.FC<ModalProps> = (props) => {
  let modalContent: ReactNode = (
    <div className={`modal_sec ${props.className}`} style={props.style}>
      <div className="modal_header flex p-2 justify-center items-center">
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
      
      <div className={`overflow-auto ${props.contentClassName}`}>
        {props.children}
      </div>
    </div>
  );

  return (
    <>
      {!props.noBackDrop && <Backdrop onClick={props.onCloseBackdrop} />}
      {ReactDOM.createPortal(
        modalContent,
        document.getElementById("modal-hook")!
      )}
    </>
  );
};

export default Modal;
