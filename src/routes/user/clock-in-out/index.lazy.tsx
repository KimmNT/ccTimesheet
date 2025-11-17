import ClockInOut from "@/views/User/components/ClockInOut/ClockInOut";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/user/clock-in-out/")({
  component: ClockInOut,
});
