import { useMutation } from "react-query";
import { promoteRelease } from "../data/promoteRelease";
import { notifications } from "@mantine/notifications";
import { handleApiError } from "~/utils/handleApiError";

export const usePromoteRelease = () => {
  return useMutation(promoteRelease, {
    onError: (e) => {
      notifications.show({
        color: "red",
        title: "Deployment Promotion",
        message: handleApiError(e, "Error While promoting deployment"),
      });
    },
  });
};
