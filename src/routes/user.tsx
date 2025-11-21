import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { isAuthenticated, getUserRole } from "@/utils/auth/sessionManager";

export const Route = createFileRoute("/user")({
  beforeLoad: async () => {
    if (!isAuthenticated() || getUserRole() !== "user") {
      throw redirect({ to: "/login" });
    }
  },
  component: UserLayout,
});

function UserLayout() {
  return (
    <>
      <Outlet />
    </>
  );
}
