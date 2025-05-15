import { json } from "@remix-run/node";
import { env } from "~/.server/services/config";

export const loader = async () => {
  // Check if Google credentials are missing
  const useMockAuth = !env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET;
  
  return json({
    useMockAuth,
    configured: !useMockAuth,
  });
}; 