import {
  Button,
  Center,
  TextInput,
  Box,
  Modal,
  NativeSelect,
  rem,
  CopyButton,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCreateToken } from "./hooks/useCreateToken";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { CreateTokenArgs } from "./data/createToken";

export type CreateTokenFormProps = {
  open: boolean;
  onClose: () => void;
};

export function CreateTokenForm({ open, onClose }: CreateTokenFormProps) {
  const { mutate, data, isLoading, reset } = useCreateToken();
  const form = useForm<{ name: string; access: CreateTokenArgs["access"] }>({
    mode: "uncontrolled",
    initialValues: { name: "", access: "Read" },
    validateInputOnChange: true,
    validate: {
      name: (value) => {
        return value.length ? null : "Name  Can't be Empty";
      },
    },
  });
  return (
    <Modal
      opened={open}
      onClose={() => {
        form.reset();
        onClose();
        reset();
      }}
      title={"Create Token"}
    >
      <Center>
        <Box w={"300px"}>
          <TextInput
            label="Enter Token Name"
            placeholder="Token Name"
            key={form.key("name")}
            {...form.getInputProps("name")}
            mt={"md"}
            disabled={isLoading}
          />

          <NativeSelect
            label="Access Type"
            data={["All", "Write", "Read"]}
            mt={"md"}
            key={form.key("access")}
            {...form.getInputProps("access")}
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

          {!data && (
            <Button
              color="blue"
              fullWidth
              mt="md"
              radius="md"
              disabled={!!Object.keys(form.errors).length && !isLoading}
              loading={isLoading}
              onClick={() => {
                if (form.validate().hasErrors) {
                  return;
                }
                mutate(form.getValues());
              }}
            >
              Create Token
            </Button>
          )}
        </Box>
      </Center>
    </Modal>
  );
}
