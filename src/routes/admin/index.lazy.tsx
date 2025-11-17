import Admin from "@/views/Admin/Admin";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/admin/")({
  component: Admin,
});
