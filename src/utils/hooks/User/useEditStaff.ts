import { db } from "../../../../firebase";
import type { Staff } from "@/lib/staff/modal";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";

type EditStaffData = Partial<Omit<Staff, "id">>;

export const useEditStaff = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editStaff = async (staffId: string, staffData: EditStaffData) => {
    setIsLoading(true);
    setError(null);

    try {
      await updateDoc(doc(db, "users", staffId), staffData);
      setIsLoading(false);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setIsLoading(false);
      return false;
    }
  };

  return { editStaff, isLoading, error };
};
