// routes/logout.tsx
import { ActionFunction, LoaderFunctionArgs } from "@remix-run/node";
import { AuthenticatorService } from "~/.server/services/Auth/Auth";

// Redirect users who try to access this route with a GET request
export const loader = ({ request }: LoaderFunctionArgs) => {
  return AuthenticatorService.isLoggedIn(request);
};

// Handle the POST request to log out the user
export const action: ActionFunction = async ({ request }) => {
  return await AuthenticatorService.logout(request);
};
