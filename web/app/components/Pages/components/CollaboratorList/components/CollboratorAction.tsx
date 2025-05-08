import { Flex, Button, Text } from "@mantine/core";
import { useState } from "react";
import { AddCollboratorForm } from "../../AddCollboratorForm";
import { useRemoveCollabarator } from "../hooks/useRemoveCollabarator";
import { useParams } from "@remix-run/react";
import { notifications } from "@mantine/notifications";
import { handleApiError } from "~/utils/handleApiError";

type CollabaratorActionProps = {
  selected: string[];
  refetch: () => void;
  setDisable: (status: boolean) => void;
  disable: boolean;
};

export const CollabaratorAction = ({
  selected,
  refetch,
  setDisable,
  disable,
}: CollabaratorActionProps) => {
  const [open, setOpen] = useState(false);
  const selectedCount = selected.length;
  const { mutateAsync } = useRemoveCollabarator();
  const params = useParams();

  const onDelete = async () => {
    try {
      setDisable(true);
      const data = await Promise.allSettled(
        selected.map((item) => {
          return mutateAsync(
            {
              appId: params.app ?? "",
              tenant: params.org ?? "",
              email: item,
            },
            {
              onError: (e) => {
                notifications.show({
                  color: "red",
                  title: `Collaborator Deletion ${item}`,
                  message: handleApiError(
                    e,
                    "Error While Removing Collaborator"
                  ),
                });
              },
            }
          );
        })
      );
      setDisable(false);

      const isFailed = data.filter((item) => item.status === "rejected");

      if (!isFailed) {
        notifications.show({
          color: "green",
          title: `Collaborator Deletion`,
          message: `${selected.join(",")}  collaborators removed successfully!`,
        });
        refetch();
      }
    } catch (e) {
      setDisable(false);
    }
  };

  return (
    <>
      <AddCollboratorForm open={open} onClose={() => setOpen(false)} />
      <Flex align={"center"} justify={"space-between"}>
        <Text>
          {selectedCount ? `${selectedCount} rows selected` : "Collabarator"}
        </Text>
        <Button
          color={selectedCount ? "red" : "blue"}
          loading={disable}
          onClick={() => {
            if (!selectedCount) {
              return setOpen(true);
            }
            onDelete();
          }}
        >
          {selectedCount
            ? `Delete ${selectedCount} Collaborator`
            : "Add Collaborator"}
        </Button>
      </Flex>
    </>
  );
};
