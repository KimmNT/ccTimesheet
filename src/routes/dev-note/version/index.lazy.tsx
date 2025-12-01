import Version from "@/views/Version/Version";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/dev-note/version/")({
  component: Version,
});
