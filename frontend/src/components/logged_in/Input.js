import React, { useState } from 'react';

function Input({ name, type, reqd, value="", onChange }) {
  const [errMsg, setErrMsg] = useState("");

  function handleChange(e) {
      let error = "";
      if (onChange) {
          error = onChange(e);
      }
      if (reqd && !e.target.value) {
          error = name + " field is required.";
      } 
      setErrMsg(error);
  }

  // if this is an input for a location, display a text box
  type = type === "location" ? "text" : type;

  return (
      <div>
          <label htmlFor={name} className="form-label mt-4">
              {name}{reqd && <span className="text-secondary">*</span>}
          </label>
          <input className={"form-control" + (errMsg ? " is-invalid" : "")} type={type} id={name} 
              value={value} onChange={handleChange} onBlur={handleChange}></input>
          {/* Error message (only displayed when errMsg is not empty) */}
          {errMsg && <div className="invalid-feedback">{errMsg}</div>}
      </div>
  )
}
export default Input;