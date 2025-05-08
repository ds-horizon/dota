import { Modal } from "@mantine/core";
import { ReleaseDetailCard } from "../ReleaseDetailCard";
import { useSearchParams } from "@remix-run/react";

export type ReleaseDeatilCardModalProps = {
  opened: boolean;
  id: string | null;
  close: () => void;
  deploymentName?: string;
};

export const ReleaseDeatilCardModal = ({
  opened,
  id,
  close,
  deploymentName,
}: ReleaseDeatilCardModalProps) => {
  const [_, setSearchParams] = useSearchParams();
  return id ? (
    <Modal
      opened={opened}
      onClose={close}
      title={`Release Details (${deploymentName ?? ""})`}
      centered
      size={"xl"}
    >
      <ReleaseDetailCard
        id={id}
        onEditClick={() =>
          setSearchParams((p) => {
            p.set("edit", "true");
            return p;
          })
        }
        onPromoteClick={() =>
          setSearchParams((p) => {
            p.set("promote", "true");
            return p;
          })
        }
      />
    </Modal>
  ) : (
    <></>
  );
};
