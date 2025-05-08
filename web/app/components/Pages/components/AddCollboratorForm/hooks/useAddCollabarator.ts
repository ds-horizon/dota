import { useMutation } from "react-query";

import { notifications } from "@mantine/notifications";
import { addCollabarator } from "../data/addCollabarator";
import { handleApiError } from "~/utils/handleApiError";

export const useAddCollabarator = () => {
  return useMutation(addCollabarator, {
    onError: (e) => {
      notifications.show({
        color: "red",
        title: "Collaborator Addition",
        message: handleApiError(e, "Error While Adding Collaborator"),
      });
    },
  });
};
