import { json } from "@remix-run/react";

export const loader = () => {
  return json({ message: "welcome to dashboard" }, { status: 200 });
};
