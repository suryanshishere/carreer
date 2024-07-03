import React from "react";
import ReactDOM from "react-dom";
import Backdrop from "../Backdrop";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import "./Modal.css";
import { IconButton } from "@mui/material";

interface ModalProps {
  show: boolean;
  onCancel?: () => void;
  onCancelBackdrop?: () => void;
  className?: string;
  style?: React.CSSProperties;
  header?: string;
  contentClass?: string;
  footerClass?: string;
  clearModalFooter?: React.ReactNode;
  footer?: React.ReactNode;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  children?: React.ReactNode;
  otherModal?: boolean;
}

const ModalOverlay: React.FC<ModalProps> = (props) => {
  let content: React.ReactNode;

  if (props.otherModal) {
    content = (
      <div
        className={`other_modal modal_common fixed top-1/2 left-1/2 h-auto w-auto ${props.className}`}
        style={props.style}
      >
        {" "}
        <div className="modal_header flex p-2 justify-center items-center">
          <header className=" text-center m-0 font-bold">{props.header}</header>
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
            onClick={props.onCancel}
          >
            <CloseIcon />
          </IconButton>
          <hr />
        </div>
        {props.children}
      </div>
    );
  } else {
    content = (
      <div
        className={`modal modal_common flex flex-col fixed top-1/2 left-1/2 h-auto ${props.className}`}
        style={props.style}
      >
        <div className="modal_header flex justify-center">
          <header className="p-2 text-center m-0 font-bold">
            {props.header}
          </header>
        </div>
        {props.header && <hr />}
        <form
          className={`modal_content flex flex-col justify-between w-full h-4/5	overflow-auto ${props.contentClass}`}
          onSubmit={
            props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
          }
        >
          {props.children
            ? props.children
            : "Something went wrong! Try re-submitting by refreshing the page."}
        </form>
        <footer
          className={`modal_footer p-1 flex justify-center items-center self-end ${props.footerClass}`}
        >
          {props.onCancel && (
            <IconButton onClick={props.onCancel}>
              <ArrowBackIcon />
            </IconButton>
          )}
          {props.footer}
        </footer>
      </div>
    );
  }

  return ReactDOM.createPortal(content, document.getElementById("modal-hook")!);
};

const Modal: React.FC<ModalProps> = (props) => {
  return (
    <>
      {props.show && <Backdrop onClick={props.onCancelBackdrop} />}
      <ModalOverlay {...props} />
    </>
  );
};

export default Modal;
