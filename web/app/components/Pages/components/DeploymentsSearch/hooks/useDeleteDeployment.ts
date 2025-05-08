import { useMutation } from "react-query";

import { notifications } from "@mantine/notifications";
import { handleApiError } from "~/utils/handleApiError";
import { deleteDeployment } from "../data/deleteDeployment";

export const useDeleteDeployment = () => {
  return useMutation(deleteDeployment, {
    onError: (e) => {
      notifications.show({
        color: "red",
        title: "Deployment Deletion",
        message: handleApiError(e, "Error While Deleting Deployment"),
      });
    },
    onSuccess: () => {
      notifications.show({
        title: "Deployment Deletion",
        message: "Deployment Deleted Successfully",
      });
    },
  });
};
