import React from 'react';

function PanicButton({ onClick }) {
  return (
    <button className="panic-button" onClick={onClick}>
      PANIC
    </button>
  );
}

export default PanicButton;