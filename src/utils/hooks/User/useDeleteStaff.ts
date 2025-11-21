import { db } from "../../../../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { useState } from "react";

export const useDeleteStaff = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteStaff = async (staffId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteDoc(doc(db, "users", staffId));
      setIsLoading(false);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setIsLoading(false);
      return false;
    }
  };

  return { deleteStaff, isLoading, error };
};
