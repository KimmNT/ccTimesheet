import { useCallback, useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/../firebase";
import type { ClockInOut } from "@/lib/attendance/modal";

export const useGetAllAttendances = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<
    (ClockInOut & { id: string })[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllAttendance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const attendanceRef = collection(db, "attendances");
      const attendanceQuery = query(attendanceRef);

      const attendanceSnapshot = await getDocs(attendanceQuery);

      if (attendanceSnapshot.empty) {
        console.log("No attendance records found.");
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
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllAttendance();
  }, [fetchAllAttendance]);

  return { attendanceRecords, loading, error, refetch: fetchAllAttendance };
};
