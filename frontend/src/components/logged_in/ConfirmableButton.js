import React, { useState } from 'react';

function ConfirmableButton({ text, onConfirm, className, style }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleMouseLeave() {
    setConfirmDelete(false);
  }

  function handleClick() {
    if (confirmDelete) {
      onConfirm();
    } else {
      setConfirmDelete(true);
    }
  }

  return (
    <button className={className} style={style} onMouseLeave={handleMouseLeave} onClick={handleClick}>
      {confirmDelete ? "Confirm" : text}
    </button>
  );
}
export default ConfirmableButton;