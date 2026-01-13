"use client";

import React, { createContext, useContext } from 'react';

export const DbContext = createContext({});

export const DbProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <DbContext.Provider value={{}}>
      {children}
    </DbContext.Provider>
  );
};