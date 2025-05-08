import { Button, Center, TextInput, Box, Modal } from "@mantine/core";
import { useForm } from "@mantine/form";

import { useParams } from "@remix-run/react";
import { useAddCollabarator } from "./hooks/useAddCollabarator";

export type AddCollboratorFormProps = {
  open: boolean;
  onClose: () => void;
};

export function AddCollboratorForm({ open, onClose }: AddCollboratorFormProps) {
  const params = useParams();
  const { mutate, isLoading } = useAddCollabarator();
  const form = useForm<{ name: string }>({
    mode: "uncontrolled",
    initialValues: { name: "collborator@email.com" },
    validateInputOnChange: true,
    validate: {
      name: (value) => {
        return value.length ? null : "Email  Can't be Empty";
      },
    },
  });
  return (
    <Modal opened={open} onClose={onClose} title={"Add Collborator"}>
      <Center>
        <Box w={"300px"}>
          <TextInput
            label="Enter Email"
            placeholder="collborator@email.com"
            key={form.key("name")}
            {...form.getInputProps("name")}
            mt={"md"}
            disabled={isLoading}
          />
          <Button
            color="blue"
            fullWidth
            mt="md"
            radius="md"
            disabled={!!Object.keys(form.errors).length && !isLoading}
            loading={isLoading}
            onClick={() => {
              mutate(
                {
                  appId: params.app ?? "",
                  tenant: params.org ?? "",
                  email: form.getValues().name,
                },
                {
                  onSuccess: () => {
                    onClose();
                    form.reset();
                  },
                }
              );
            }}
          >
            Add Collaborator
          </Button>
        </Box>
      </Center>
    </Modal>
  );
}
