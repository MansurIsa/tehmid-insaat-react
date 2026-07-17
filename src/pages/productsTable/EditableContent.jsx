import React, { useRef, useEffect } from 'react';

// contentEditable div-in komponenti
const EditableContent = ({ value, onChange }) => {
  const divRef = useRef(null);

  useEffect(() => {
    if (divRef.current && divRef.current.innerHTML !== value) {
      divRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (divRef.current) {
      onChange(divRef.current.innerHTML);
    }
  };

  return (
    <div
      ref={divRef}
      contentEditable
      onInput={handleInput}
      style={{
        minHeight: '100px',
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '8px',
        whiteSpace: 'pre-wrap',
        outline: 'none'
      }}
    />
  );
};

export default EditableContent;
