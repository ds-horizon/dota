import { notifications } from "@mantine/notifications";
import { useMutation } from "react-query";
import { handleApiError } from "~/utils/handleApiError";
import { deleteAccessToken } from "../data/deleteAccessToken";

export const useDeleteAccessToken = () => {
  return useMutation(deleteAccessToken, {
    onError: (e) => {
      notifications.show({
        color: "red",
        title: "Token Deletion",
        message: handleApiError(e, "Error While Token Deletion"),
      });
    },
  });
};
