import { useCallback, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/../firebase";
import type { ClockInOut } from "@/lib/attendance/modal";

export const useEditAttendance = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const editAttendance = useCallback(
    async (id: string, updatedData: Partial<ClockInOut>) => {
      setLoading(true);
      setError(null);
      try {
        const attendanceDoc = doc(db, "attendances", id);
        await updateDoc(attendanceDoc, updatedData);
        setLoading(false);
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Error editing attendance:", err);
        setLoading(false);
        return false;
      }
    },
    []
  );

  return { editAttendance, loading, error };
};
