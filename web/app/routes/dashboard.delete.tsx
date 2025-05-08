import { Modal } from "@mantine/core";
import { useNavigate, useSearchParams } from "@remix-run/react";
import { DeleteAction } from "~/components/Pages/components/DeleteAction";
import { ACTION_EVENTS, actions } from "~/utils/event-emitter";

export default function Profile() {
  const navigation = useNavigate();
  const [searchParams] = useSearchParams();

  const close = () => {
    actions.trigger(ACTION_EVENTS.REFETCH_ORGS);
    navigation(-1);
  };

  return (
    <Modal
      opened={true}
      onClose={close}
      title={`Delete ${searchParams.get("type")}`}
      centered
    >
      <DeleteAction onSuccess={close} />
    </Modal>
  );
}
