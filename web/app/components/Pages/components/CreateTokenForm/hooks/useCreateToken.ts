import { useMutation } from "react-query";
import { createToken } from "../data/createToken";
import { notifications } from "@mantine/notifications";
import { handleApiError } from "~/utils/handleApiError";

export const useCreateToken = () => {
  return useMutation(createToken, {
    onError: (e) => {
      notifications.show({
        color: "red",
        title: "Token Creation",
        message: handleApiError(e, "Error While Creating Token"),
      });
    },
  });
};
