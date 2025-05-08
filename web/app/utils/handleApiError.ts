import { AxiosError } from "axios";

export const handleApiError = (e: unknown, fallback: string): string => {
  try {
    const message = (e as AxiosError<{ message: unknown }>)?.response?.data
      ?.message;

    if (typeof message === "object") {
      return JSON.stringify(message);
    }

    return message?.toString() ?? fallback;
  } catch (_er) {
    console.log({ e, _er });
    return fallback;
  }
};
