import {
  Button,
  Center,
  TextInput,
  Box,
  Modal,
  rem,
  CopyButton,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useCreateDeployment } from "./hooks/useCreateDeployment";
import { useParams } from "@remix-run/react";

export type CreateTokenFormProps = {
  open: boolean;
  onClose: () => void;
};

export function CreateDeploymentForm({ open, onClose }: CreateTokenFormProps) {
  const params = useParams();
  const { mutate, data, isLoading } = useCreateDeployment();
  const form = useForm<{ name: string }>({
    mode: "uncontrolled",
    initialValues: { name: "Enter Name" },
    validateInputOnChange: true,
    validate: {
      name: (value) => {
        return value.length ? null : "Name  Can't be Empty";
      },
    },
  });
  return (
    <Modal opened={open} onClose={onClose} title={"Create Deployment"}>
      <Center>
        <Box w={"300px"}>
          <TextInput
            label="Enter Deployment Name"
            placeholder="Deployment"
            key={form.key("name")}
            {...form.getInputProps("name")}
            mt={"md"}
            disabled={isLoading}
          />

          {data && (
            <CopyButton value={data.name}>
              {({ copied, copy }) => (
                <Button
                  leftSection={
                    <Text
                      style={{
                        textOverflow: "ellipsis",
                        width: rem(90),
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {data.name}
                    </Text>
                  }
                  onClick={copy}
                  rightSection={
                    copied ? (
                      <IconCheck style={{ width: rem(18) }} />
                    ) : (
                      <IconCopy style={{ width: rem(18) }} />
                    )
                  }
                  w={"100%"}
                  mt={"md"}
                  variant="light"
                />
              )}
            </CopyButton>
          )}

          <Button
            color="blue"
            fullWidth
            mt="md"
            radius="md"
            disabled={!!Object.keys(form.errors).length && !isLoading}
            loading={isLoading}
            onClick={() => {
              mutate(
                { ...form.getValues(), appId: params.app ?? "" },
                {
                  onSuccess: () => {
                    onClose();
                    form.reset();
                  },
                }
              );
            }}
          >
            Create Deployment
          </Button>
        </Box>
      </Center>
    </Modal>
  );
}
