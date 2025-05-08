import { useSubmit } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { AuthenticatorService } from "~/.server/services/Auth/Auth";
import { LoginForm } from "~/components/Pages/Login";

export const loader = ({ request }: LoaderFunctionArgs) => {
  return AuthenticatorService.isLoggedIn(request);
};

export default function AuthenticationForm() {
  const submit = useSubmit();

  const login = () => {
    submit(null, {
      method: "post",
      action: `/auth/google`,
    });
  };

  return <LoginForm onClickLogin={login} />;
}
