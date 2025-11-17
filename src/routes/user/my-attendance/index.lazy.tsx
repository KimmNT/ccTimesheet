import AttendanceHistory from "@/views/User/components/AttendanceHistory/AttendanceHistory";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/user/my-attendance/")({
  component: AttendanceHistory,
});
