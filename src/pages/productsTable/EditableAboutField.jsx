import React, { useEffect, useRef } from 'react';

const EditableAboutField = ({ value, onChange }) => {
  const aboutRef = useRef(null);

  // İlk renderdə və ya value dəyişəndə innerHTML güncəllənir
  useEffect(() => {
    if (aboutRef.current && aboutRef.current.innerHTML !== value) {
      aboutRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    if (aboutRef.current) {
      onChange(aboutRef.current.innerHTML);
    }
  };

  return (
    <div className="form_group">
      <label>Haqqında</label>
      <div
        ref={aboutRef}
        contentEditable
        onInput={handleInput}
        placeholder="Məhsul haqqında məlumat..."
        style={{
          minHeight: "150px",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "8px",
          whiteSpace: "pre-wrap",
          outline: "none",
        }}
      />
    </div>
  );
};

export default EditableAboutField;
