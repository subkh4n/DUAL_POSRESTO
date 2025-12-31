"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface Branch {
  id: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

interface BranchContextType {
  currentBranch: Branch | null;
  setBranch: (branch: Branch) => void;
  branches: Branch[];
  isLoaded: boolean;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export function BranchProvider({ children }: { children: React.ReactNode }) {
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Mock branches for now - in a real app, fetch from Supabase
  const branches: Branch[] = [
    {
      id: "branch-a",
      name: "Toko Pusat (A)",
      address: "Jl. Sudirman No. 1",
      latitude: -6.2088,
      longitude: 106.8456,
    },
    {
      id: "branch-b",
      name: "Cabang Mal (B)",
      address: "Mal Grand Indonesia, Lt. LG",
      latitude: -6.1953,
      longitude: 106.8231,
    },
  ];

  useEffect(() => {
    const savedBranch = localStorage.getItem("resto_selected_branch");
    if (savedBranch) {
      try {
        const parsed = JSON.parse(savedBranch);
        setCurrentBranch(parsed);
      } catch (e) {
        console.error("Failed to parse saved branch", e);
      }
    } else if (branches.length > 0) {
      // Default to first branch if none saved
      setCurrentBranch(branches[0]);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded && currentBranch) {
      localStorage.setItem(
        "resto_selected_branch",
        JSON.stringify(currentBranch)
      );
    }
  }, [currentBranch, isLoaded]);

  const setBranch = (branch: Branch) => {
    setCurrentBranch(branch);
  };

  return (
    <BranchContext.Provider
      value={{
        currentBranch,
        setBranch,
        branches,
        isLoaded,
      }}
    >
      {children}
    </BranchContext.Provider>
  );
}

export function useBranch() {
  const context = useContext(BranchContext);
  if (context === undefined) {
    throw new Error("useBranch must be used within a BranchProvider");
  }
  return context;
}
