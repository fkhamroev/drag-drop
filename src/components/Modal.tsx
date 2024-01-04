import React from "react";

const Modal = ({ onClose, children }) => {
  const handleClose = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={handleClose}>
          ❌
        </button>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
