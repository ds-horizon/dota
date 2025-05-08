import { useMutation } from "react-query";

import { notifications } from "@mantine/notifications";
import { removeAppCollabarator } from "../data/removeAppCollaborator";
import { handleApiError } from "~/utils/handleApiError";

export const useRemoveCollabarator = () => {
  return useMutation(removeAppCollabarator, {
    onError: (e) => {
      notifications.show({
        color: "red",
        title: "Collaborator Deletion",
        message: handleApiError(e, "Error While Removing Collaborator"),
      });
    },
  });
};
