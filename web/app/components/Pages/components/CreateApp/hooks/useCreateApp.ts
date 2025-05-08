import { useMutation } from "react-query";
import { notifications } from "@mantine/notifications";
import { createApp } from "../data/createApp";
import { handleApiError } from "~/utils/handleApiError";

export const useCreateApp = () => {
  return useMutation(createApp, {
    onError: (e) => {
      notifications.show({
        color: "red",
        title: "App Creation",
        message: handleApiError(e, "Error While Creating App"),
      });
    },
  });
};
