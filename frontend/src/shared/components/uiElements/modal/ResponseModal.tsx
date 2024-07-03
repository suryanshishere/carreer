import React from "react";
import ReactDOM from "react-dom";
import Backdrop from "../Backdrop";
import { motion } from "framer-motion";
import "./ResponseModal.css";

interface ResponseModalProps {
  show: boolean;
  onCancel?: () => void;
  onCancelBackdrop?: () => void;
  className?: string;
  style?: React.CSSProperties;
  header?: string;
  contentClass?: string;
  children?: React.ReactNode;
  showBackdrop?: boolean;
}

const BehaveModal: React.FC<ResponseModalProps> = (props) => {
  const { show, className, style, children } = props;
  if (!show) {
    return null;
  }
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: 0,
          ease: [0.25, 0.75, 0.25, 1],
        }}
        className={`response_modal z-50 fixed top-2 text-center right-2 w-auto ${className}`}
        style={style}
      >
        {children}
      </motion.div>
    </>
  );
};

export default BehaveModal;
