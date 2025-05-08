import { Modal } from "@mantine/core";
import { useNavigate } from "@remix-run/react";
import { CreateOrgForm } from "~/components/CreateOrgForm";

export default function CreateOrgPage() {
  const navigation = useNavigate();
  return (
    <Modal
      opened={true}
      onClose={() => {
        navigation(-1);
      }}
      title="Create Application"
      centered
    >
      <CreateOrgForm />
    </Modal>
  );
}
