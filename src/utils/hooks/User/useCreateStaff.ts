import { db } from "../../../../firebase";
import type { Staff } from "@/lib/staff/modal";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";

type CreateStaffData = Omit<Staff, "id" | "status"> & {
  status: boolean;
};

export const useCreateStaff = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createStaff = async (staffData: CreateStaffData) => {
    setIsLoading(true);
    setError(null);

    try {
      const docRef = await addDoc(collection(db, "users"), {
        ...staffData,
      });

      setIsLoading(false);
      return docRef.id;
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setIsLoading(false);
      return null;
    }
  };

  return { createStaff, isLoading, error };
};
