import React, { useEffect } from "react";
import ReactDOM from "react-dom";

export default function Modal({ children, onClose }) {
  if (!onClose) return null;

  useEffect(() => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const docEl = document.documentElement;

    // save previous styles
    const prevDocOverflow = docEl.style.overflowY;
    const prevBodyPosition = document.body.style.position;
    const prevBodyTop = document.body.style.top;
    const prevBodyWidth = document.body.style.width;

    // keep scrollbar visible on the root and lock page scroll by fixing body
    docEl.style.overflowY = "scroll";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      // restore previous styles and scroll position
      document.body.style.position = prevBodyPosition || "";
      document.body.style.top = prevBodyTop || "";
      document.body.style.width = prevBodyWidth || "";
      docEl.style.overflowY = prevDocOverflow || "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  return ReactDOM.createPortal(
    <div
      onClick={onClose}
      className="inset-0 fixed z-50 bg-black/40 h-screen w-screen flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-5 rounded-xl"
      >
        {children}
      </div>
    </div>,
    document.getElementById("portal")
  );
}
