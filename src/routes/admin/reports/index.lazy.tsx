import Reports from "@/views/Admin/Reports/Reports";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/admin/reports/")({
  component: Reports,
});
