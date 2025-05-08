import { useMutation } from "react-query";
import { createDeployment } from "../data/createDeployment";
import { notifications } from "@mantine/notifications";
import { handleApiError } from "~/utils/handleApiError";

export const useCreateDeployment = () => {
  return useMutation(createDeployment, {
    onError: (e) => {
      notifications.show({
        color: "red",
        title: "Deployment Creation",
        message: handleApiError(e, "Error While Creating Deployment"),
      });
    },
  });
};
