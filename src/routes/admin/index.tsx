import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated, getUserRole } from "@/utils/auth/sessionManager";

export const Route = createFileRoute("/admin/")({
  beforeLoad: async () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/login" });
    }
    if (getUserRole() !== "admin") {
      throw redirect({ to: "/login" });
    }
  },
});
