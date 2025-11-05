"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    $crisp: string[][];
    CRISP_WEBSITE_ID: string;
  }
}

export default function FloatingItems() {
  useEffect(() => {
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "f226ecbb-f148-41ab-b240-0b9c1016dba6";
    const script = document.createElement("script");
    script.src = "https://client.crisp.chat/l.js";
    script.async = true;
    document.getElementsByTagName("head")[0].appendChild(script);
  }, []);

  return (
    <>
      <a
        href={"https://t.me/lightningproxies"}
        target="_blank"
        aria-label="Telegram"
        className="fixed z-[999] bottom-20 sm:bottom-24 right-3 sm:right-6 w-[54px] sm:w-[60px] aspect-square flex"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg"
          alt=""
          className="w-full h-full"
        />
      </a>
    </>
  );
}


