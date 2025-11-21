import Staffs from "@/views/Admin/Staffs/Staffs";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/admin/staffs/")({
  component: Staffs,
});
