import { redirect } from "@remix-run/react";
import { route } from "routes-gen";

export const loader = () => {
  return redirect(route("/dashboard"));
};
