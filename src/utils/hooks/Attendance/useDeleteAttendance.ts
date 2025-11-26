import { useCallback, useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/../firebase";

export const useDeleteAttendance = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAttendance = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const attendanceDoc = doc(db, "attendances", id);
      await deleteDoc(attendanceDoc);
      setLoading(false);
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Error deleting attendance:", err);
      setLoading(false);
      return false;
    }
  }, []);

  return { deleteAttendance, loading, error };
};
