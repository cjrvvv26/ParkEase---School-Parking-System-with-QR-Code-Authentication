import React from "react";

export default function DefaultInput({
  label,
  value,
  onChange,
  placeholder,
  onlyRead,
  type,
}) {
  return (
    <label className="flex flex-col text-sm">
      <span className={`${onlyRead ? "text-gray-500" : "text-gray-700"}`}>
        {label}
      </span>
      <input
        value={value}
        readOnly={onlyRead}
        onChange={onChange}
        type={type || "text"}
        placeholder={placeholder}
        className={`${onlyRead ? "mt-2 px-3 py-2 text-sm placeholder:text-gray-400 outline-none text-gray-700" : "hover:ring-violet-500 focus:ring-violet-500 hover:ring-2 focus:ring-2 ring rounded-md ring-gray-200 mt-2 px-3 py-2 text-sm placeholder:text-gray-400 outline-none text-gray-700"}`}
      />
    </label>
  );
}
