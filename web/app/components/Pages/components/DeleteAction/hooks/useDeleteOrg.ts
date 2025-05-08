import { useMutation } from "react-query";

import { notifications } from "@mantine/notifications";
import { deleteOrg } from "../data/deleteOrg";
import { handleApiError } from "~/utils/handleApiError";

export const useDeleteOrg = () => {
  return useMutation(deleteOrg, {
    onError: (e) => {
      notifications.show({
        color: "red",
        title: "Org Deletion",
        message: handleApiError(e, "Error While Deleting Org"),
      });
    },
  });
};
