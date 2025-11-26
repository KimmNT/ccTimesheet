import { useCallback, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/../firebase";
import type { ClockInOut } from "@/lib/attendance/modal";

export const useCreateAttendance = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createAttendance = useCallback(
    async (attendanceData: Omit<ClockInOut, "id">) => {
      setLoading(true);
      setError(null);
      try {
        const attendanceCollection = collection(db, "attendances");
        const docRef = await addDoc(attendanceCollection, {
          ...attendanceData,
        });
        setLoading(false);
        return docRef.id;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Error creating attendance:", err);
      }
    },
    []
  );

  return { createAttendance, loading, error };
};
