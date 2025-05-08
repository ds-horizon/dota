import { useMutation } from "react-query";
import { deleteAppForOrg } from "../data/deleteAppForOrg";
import { notifications } from "@mantine/notifications";
import { handleApiError } from "~/utils/handleApiError";

export const useDeleteAppForOrg = () => {
  return useMutation(deleteAppForOrg, {
    onError: (e) => {
      notifications.show({
        color: "red",
        title: "App Deletion",
        message: handleApiError(e, "Error While Deleting App"),
      });
    },
  });
};
