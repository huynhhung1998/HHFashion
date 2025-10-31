import React, { useState } from "react";

export function Select({ children, onChange }) {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  return (
    <select value={value} onChange={handleChange} className="border p-2 rounded">
      {children}
    </select>
  );
}

export function SelectTrigger({ children }) {
  return <>{children}</>;
}

export function SelectContent({ children }) {
  return <>{children}</>;
}

export function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>;
}
