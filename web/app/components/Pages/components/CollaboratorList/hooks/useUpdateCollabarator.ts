import { useMutation } from "react-query";

import { notifications } from "@mantine/notifications";
import { updateAppCollabarator } from "../data/updateAppCollaborator";
import { handleApiError } from "~/utils/handleApiError";

export const useUpdateCollabarator = () => {
  return useMutation(updateAppCollabarator, {
    onError: (e) => {
      notifications.show({
        color: "red",
        title: "Collaborator Updation",
        message: handleApiError(e, "Error While Update Collaborator"),
      });
    },
  });
};
