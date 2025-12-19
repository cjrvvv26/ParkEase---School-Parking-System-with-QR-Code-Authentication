import React from "react";

export default function DefaultInput({ label, value, onChange, placeholder }) {
  return (
    <label className="flex flex-col text-sm">
      <span className="text-gray-700">{label}</span>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-2 px-3 py-2 ring rounded-md text-sm ring-gray-200 placeholder:text-gray-400 outline-none hover:ring-violet-500 focus:ring-violet-500 hover:ring-2 focus:ring-2 text-gray-700"
      />
    </label>
  );
}
