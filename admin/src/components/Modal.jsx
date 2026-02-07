import React, { useEffect } from "react";
import ReactDOM from "react-dom";

// Keep a global count of open modals
let openModalCount = 0;
let lastScrollY = 0;

export default function Modal({ children, onClose }) {
  if (!onClose) return null;

  useEffect(() => {
    const docEl = document.documentElement;

    // If first modal, lock scroll and save position
    if (openModalCount === 0) {
      lastScrollY = window.scrollY || document.documentElement.scrollTop;
      docEl.style.overflowY = "scroll";
      document.body.style.position = "fixed";
      document.body.style.top = `-${lastScrollY}px`;
      document.body.style.width = "100%";
    }

    openModalCount++;

    return () => {
      openModalCount--;

      // Only restore scroll when all modals are closed
      if (openModalCount === 0) {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        docEl.style.overflowY = "";
        window.scrollTo(0, lastScrollY);
      }
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
    document.getElementById("portal"),
  );
}
