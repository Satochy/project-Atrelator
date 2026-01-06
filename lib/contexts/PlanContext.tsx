"use client";

import React, { createContext, useContext } from "react";

interface PlanContextProps {
  hasProPlan: boolean;
  hasEnterprisePlan: boolean;
}

const PlanContext = createContext<PlanContextProps | undefined>(undefined);

export const PlanProvider = ({ 
  children, 
  hasProPlan, 
  hasEnterprisePlan 
}: { 
  children: React.ReactNode; 
  hasProPlan: boolean; 
  hasEnterprisePlan: boolean; 
}) => {
  return (
    <PlanContext.Provider value={{ hasProPlan, hasEnterprisePlan }}>
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error("usePlan needs to be inside the provider");
  }
  return context;
};