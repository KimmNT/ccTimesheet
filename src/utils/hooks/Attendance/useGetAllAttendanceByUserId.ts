import { useCallback, useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/../firebase";
import type { ClockInOut } from "@/lib/attendance/modal";

export const useGetAllAttendanceByUserId = (userId: string) => {
  const [attendanceRecords, setAttendanceRecords] = useState<
    (ClockInOut & { id: string })[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllAttendance = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const attendanceRef = collection(db, "attendances");
      const attendanceQuery = query(
        attendanceRef,
        where("userId", "==", userId)
      );

      const attendanceSnapshot = await getDocs(attendanceQuery);

      if (attendanceSnapshot.empty) {
        console.log("No attendance records found for user:", userId);
        setAttendanceRecords([]);
        setLoading(false);
        return;
      }

      const records = attendanceSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as (ClockInOut & { id: string })[];

      setAttendanceRecords(records);
    } catch (err) {
      console.error("Error fetching attendance records:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAllAttendance();
  }, [fetchAllAttendance]);

  return { attendanceRecords, loading, error, refetch: fetchAllAttendance };
};
