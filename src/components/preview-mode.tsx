"use client";

import { createContext, useContext } from "react";

const PreviewModeContext = createContext(false);

export function PreviewModeProvider({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <PreviewModeContext.Provider value={active}>
      {children}
    </PreviewModeContext.Provider>
  );
}

export function usePreviewMode() {
  return useContext(PreviewModeContext);
}
