import { useCallback, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/../firebase";
import type { Staff } from "@/lib/staff/modal";

export const useGetAllStaff = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllStaff = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const userRef = collection(db, "users");
      const userSnapshot = await getDocs(userRef);

      if (userSnapshot.empty) {
        console.log("No staff found in user collection");
        setStaff([]);
        setLoading(false);
        return;
      }

      const staffList = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Staff[];

      setStaff(staffList);
    } catch (err) {
      console.error("Error fetching staff:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllStaff();
  }, [fetchAllStaff]);

  return { staff, loading, error, refetch: fetchAllStaff };
};
