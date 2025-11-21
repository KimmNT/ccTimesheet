import Attendances from "@/views/Admin/Attendances/Attendances";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/admin/attendance/")({
  component: Attendances,
});
