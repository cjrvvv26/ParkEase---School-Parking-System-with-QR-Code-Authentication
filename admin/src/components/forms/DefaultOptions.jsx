import React, { useState, useRef, useEffect } from "react";

export default function DefaultOptions({
  label,
  value,
  onChange,
  placeholder,
  options = [],
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    if (typeof onChange === "function") {
      try {
        onChange({ target: { value: option } });
      } catch {
        onChange(option);
      }
    }
    setOpen(false);
  };

  return (
    <label ref={ref} className="relative flex flex-col text-sm">
      <span className="text-gray-700">{label}</span>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-2 px-3 py-2 relative ring rounded-md text-sm ring-gray-200 hover:ring-violet-500 focus:ring-violet-500 hover:ring-2 focus:ring-2 bg-white flex items-center justify-between"
      >
        <span
          className={`${
            value ? "text-gray-700" : "text-gray-400"
          } truncate text-left`}
        >
          {value || placeholder}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${
            open ? "rotate-180" : "rotate-0"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-20 top-[68px] bg-white ring ring-gray-200 rounded-md shadow-sm overflow-hidden">
          <ul className="max-h-56 overflow-auto">
            {options.length > 0 ? (
              options.map((option, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    onMouseDown={() => handleSelect(option)}
                    className="w-full text-left px-3 py-2 hover:bg-violet-50 hover:text-violet-700 text-sm"
                  >
                    {option}
                  </button>
                </li>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-400">No options</div>
            )}
          </ul>
        </div>
      )}
    </label>
  );
}
