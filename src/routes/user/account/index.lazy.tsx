import Account from "@/views/User/components/Account/Account";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/user/account/")({
  component: Account,
});
