import {
  createFileRoute,
  // redirect
} from "@tanstack/react-router";
// import { isAuthenticated, getUserRole } from "@/utils/auth/sessionManager";

export const Route = createFileRoute("/user/")({
  // beforeLoad: async () => {
  //   if (!isAuthenticated()) {
  //     throw redirect({ to: "/login" });
  //   }
  //   if (getUserRole() !== "user") {
  //     throw redirect({ to: "/login" });
  //   }
  // },
});
