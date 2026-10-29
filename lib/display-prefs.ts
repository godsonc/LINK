"use client";

import { useEffect, useState } from "react";

const TEXT_KEY = "link-text-size";
const CONTRAST_KEY = "link-contrast";
const CHANGE_EVENT = "link-display";

function readPrefs() {
  if (typeof window === "undefined") {
    return { textSize: "112%", contrast: false };
  }
  return {
    textSize: window.localStorage.getItem(TEXT_KEY) ?? "112%",
    contrast: window.localStorage.getItem(CONTRAST_KEY) === "1",
  };
}

function applyPrefs(textSize: string, contrast: boolean) {
  document.documentElement.style.setProperty("--font-size", textSize);
  document.documentElement.dataset.contrast = contrast ? "high" : "normal";
}

export function useDisplayPrefs() {
  const [textSize, setTextSize] = useState("112%");
  const [contrast, setContrast] = useState(false);

  useEffect(() => {
    const prefs = readPrefs();
    setTextSize(prefs.textSize);
    setContrast(prefs.contrast);
    applyPrefs(prefs.textSize, prefs.contrast);

    function sync() {
      const next = readPrefs();
      setTextSize(next.textSize);
      setContrast(next.contrast);
      applyPrefs(next.textSize, next.contrast);
    }

    window.addEventListener("storage", sync);
    window.addEventListener(CHANGE_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(CHANGE_EVENT, sync);
    };
  }, []);

  function toggleTextSize() {
    const next = textSize === "112%" ? "128%" : "112%";
    window.localStorage.setItem(TEXT_KEY, next);
    setTextSize(next);
    applyPrefs(next, contrast);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  function toggleContrast() {
    const next = !contrast;
    window.localStorage.setItem(CONTRAST_KEY, next ? "1" : "0");
    setContrast(next);
    applyPrefs(textSize, next);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  return { textSize, contrast, toggleTextSize, toggleContrast };
}
