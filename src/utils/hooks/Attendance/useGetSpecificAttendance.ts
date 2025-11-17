import { useCallback } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/../firebase";
import type { ClockInOut } from "@/lib/attendance/modal";

export const useGetSpecificAttendance = () => {
  const getSpecificAttendance = useCallback(
    async (userId: string, date: string) => {
      const attendanceRef = collection(db, "attendances");

      const getAttendanceById = query(
        attendanceRef,
        where("date", "==", date),
        where("userId", "==", userId)
      );

      const attendanceSnapshot = await getDocs(getAttendanceById);

      if (attendanceSnapshot.empty) {
        console.log("No attendance record found");
        return null;
      }

      const attendanceValue = {
        ...attendanceSnapshot.docs[0].data(),
        id: attendanceSnapshot.docs[0].id,
      } as ClockInOut & { id: string };

      return attendanceValue;
    },
    []
  );

  return { getSpecificAttendance };
};
