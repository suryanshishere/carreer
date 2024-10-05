import React, { useEffect, useState } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Modal } from "@mui/material";
import "./DataStatus.css";

interface ResponseProps {
  error?: string[];
  resMsg?: string[];
  permanentResMsg?: string[];
}

const DataStatus: React.FC<ResponseProps> = ({
  error = [],
  resMsg = [],
  permanentResMsg = [],
}) => {
  const [modalShow, setModalShow] = useState(false);
  const getLastItem = (arr: string[]) =>
    arr.length ? arr[arr.length - 1] : null;

  // Get the latest messages
  const latestError = getLastItem(error);
  const latestResMsg = getLastItem(resMsg);
  const latestPermanentResMsg = getLastItem(permanentResMsg);

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setModalShow(false);
  };

  useEffect(() => {
    // Show modal if there are any messages
    if (latestResMsg || latestError || latestPermanentResMsg) {
      setModalShow(true);
      setOpen(true);

      // If there's no permanent message, set timer to close
      if (!latestPermanentResMsg) {
        const timer = setTimeout(() => {
          handleClose();
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [latestResMsg, latestError, latestPermanentResMsg]);

  const style = {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 300,
    bgcolor: "var(--color-white)",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const NoBackdrop = (props: any) => (
    <div {...props} style={{ backgroundColor: "transparent" }} />
  );

  return (
    <Modal
      open={modalShow}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      BackdropProps={{ invisible: true }}
    >
      <Box sx={style}>
        <div className="flex flex-col items-center gap-1 font-bold">
          {latestPermanentResMsg && (
            <p className="text-custom-blue">{latestPermanentResMsg}</p>
          )}
          {latestResMsg && <p className="text-custom-green">{latestResMsg}</p>}
          {latestError && <p className="text-custom-red">{latestError}</p>}
        </div>
        <button
          className="absolute top-2 right-2 bg-transparent border-none cursor-pointer"
          onClick={handleClose}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </Box>
    </Modal>
  );
};

export default DataStatus;
