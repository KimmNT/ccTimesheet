import { useCallback } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/../firebase";
import type { Staff } from "@/lib/staff/modal";

export const useGetSpecificStaff = () => {
  const getSpecificStaff = useCallback(async (staffId: string) => {
    try {
      const userRef = collection(db, "users");

      const getStaffById = query(userRef, where("id", "==", staffId));

      const staffSnapshot = await getDocs(getStaffById);

      if (staffSnapshot.empty) {
        console.log("No staff found with the given ID");
        return null;
      }

      const staffValue = {
        ...staffSnapshot.docs[0].data(),
        id: staffSnapshot.docs[0].id,
      } as Staff & { id: string };

      return staffValue;
    } catch (error) {
      console.error("Error fetching specific staff:", error);
    }
  }, []);

  return { getSpecificStaff };
};
