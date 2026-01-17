import React from "react";

export default function Button({ name, onClick }) {
  return (
    <button className=" rounded-sm text-xs text-gray-700 px-3 py-2 hover:text-gray-500 border border-gray-200">
      {name}
    </button>
  );
}
