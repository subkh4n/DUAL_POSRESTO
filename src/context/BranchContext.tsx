"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch branches from Supabase on mount
  useEffect(() => {
    const fetchBranches = async () => {
      const { data, error } = await supabase
        .from("branches")
        .select("id, name, address, latitude, longitude")
        .eq("is_active", true)
        .order("name");

      if (error) {
        console.error("Error fetching branches:", error);
        // Fallback to empty array
        setBranches([]);
      } else if (data && data.length > 0) {
        setBranches(data);

        // Try to restore saved branch from localStorage
        const savedBranch = localStorage.getItem("resto_selected_branch");
        if (savedBranch) {
          try {
            const parsed = JSON.parse(savedBranch);
            // Verify the saved branch still exists in fetched data
            const stillExists = data.find((b) => b.id === parsed.id);
            if (stillExists) {
              setCurrentBranch(stillExists);
            } else {
              setCurrentBranch(data[0]);
            }
          } catch (e) {
            console.error("Failed to parse saved branch", e);
            setCurrentBranch(data[0]);
          }
        } else {
          // Default to first branch
          setCurrentBranch(data[0]);
        }
      }

      setIsLoaded(true);
    };

    fetchBranches();
  }, []);

  // Save selected branch to localStorage
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
