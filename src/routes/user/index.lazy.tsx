import User from "@/views/User/User";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/user/")({
  component: User,
});
