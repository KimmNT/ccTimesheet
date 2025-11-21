import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { isAuthenticated, getUserRole } from "@/utils/auth/sessionManager";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    if (!isAuthenticated() || getUserRole() !== "admin") {
      throw redirect({ to: "/login" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <>
      <Outlet />
    </>
  );
}
