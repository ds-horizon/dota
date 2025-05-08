import { useLoaderData } from "@remix-run/react";
import { User } from "~/.server/services/Auth/Auth.interface";
import { AppListForOrg } from "~/components/Pages/components/AppList";
import { authenticateLoaderRequest } from "~/utils/authenticate";

export const loader = authenticateLoaderRequest();

export default function AppsList() {
  const user = useLoaderData<User>();
  return <AppListForOrg user={user} />;
}
