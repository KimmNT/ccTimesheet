import { useCallback, useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/../firebase";
import type { ClockInOut } from "@/lib/attendance/modal";

export const useGetAttendanceByDateRange = (
  userId: string,
  startDate: string,
  endDate: string
) => {
  const [attendanceDateRangeRecords, setAttendanceDateRangeRecords] = useState<
    (ClockInOut & { id: string })[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  console.log("Hook initialized with:", { userId, startDate, endDate });

  useEffect(() => {
    console.log("useEffect triggered");

    const fetchData = async () => {
      console.log("fetchData called");

      if (!userId || !startDate || !endDate) {
        console.log("Missing parameters:", { userId, startDate, endDate });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log("Fetching with params:", { userId, startDate, endDate });

        const attendanceRef = collection(db, "attendances");
        const attendanceQuery = query(
          attendanceRef,
          where("userId", "==", userId),
          where("date", ">=", startDate),
          where("date", "<=", endDate)
        );

        const attendanceSnapshot = await getDocs(attendanceQuery);

        console.log("Snapshot empty?", attendanceSnapshot.empty);
        console.log("Snapshot size:", attendanceSnapshot.size);

        if (attendanceSnapshot.empty) {
          console.log("No attendance records found for the date range");
          setAttendanceDateRangeRecords([]);
          setLoading(false);
          return;
        }

        const records = attendanceSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as (ClockInOut & { id: string })[];

        console.log("Fetched records:", records);
        setAttendanceDateRangeRecords(records);
      } catch (err) {
        console.error("Error fetching attendance records:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, startDate, endDate]);

  const refetch = useCallback(async () => {
    if (!userId || !startDate || !endDate) return;

    try {
      setLoading(true);
      setError(null);

      const attendanceRef = collection(db, "attendances");
      const attendanceQuery = query(
        attendanceRef,
        where("userId", "==", userId),
        where("date", ">=", startDate),
        where("date", "<=", endDate)
      );

      const attendanceSnapshot = await getDocs(attendanceQuery);

      if (attendanceSnapshot.empty) {
        setAttendanceDateRangeRecords([]);
        return;
      }

      const records = attendanceSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as (ClockInOut & { id: string })[];

      setAttendanceDateRangeRecords(records);
    } catch (err) {
      console.error("Error fetching attendance records:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, [userId, startDate, endDate]);

  return {
    attendanceDateRangeRecords,
    loadingDateRangRecords: loading,
    errorDateRangeRecords: error,
    refetch,
  };
};
