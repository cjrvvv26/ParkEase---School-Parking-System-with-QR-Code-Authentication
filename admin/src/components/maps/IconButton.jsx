import React from "react";
import * as Icons from "lucide-react";

export default function IconButton({
  name,
  label,
  action,
  className = "",
  ...props
}) {
  const Icon = Icons[name];

  if (!Icon) return null;

  return (
    <button
      onClick={action}
      className="hover:bg-violet-500 group p-2 rounded-md relative"
    >
      <Icon
        className="size-5 group-hover:text-white"
        strokeWidth={1.5}
        {...props}
      />
      {/* Label */}
      <span className="bottom-10 border border-gray-200 bg-white text-gray-500 p-2 rounded-md text-xs absolute -translate-x-1/2 left-1/2 opacity-0 scale-95 transition-all group-hover:opacity-100 group-hover:scale-100 delay-100">
        {label}
      </span>
    </button>
  );
}
