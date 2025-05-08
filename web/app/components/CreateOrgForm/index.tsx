import { Card, Button, Center, TextInput, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconSitemap } from "@tabler/icons-react";

export function CreateOrgForm() {
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
    <Center>
      <Box w={"300px"}>
        <Card shadow="sm" padding="xl" radius="md">
          <Card.Section component="a">
            <Center>
              <IconSitemap height={160} size={"xl"} />
            </Center>
          </Card.Section>

          <TextInput
            label="Enter Organization Name"
            placeholder="Orgainization Name"
            key={form.key("name")}
            {...form.getInputProps("name")}
          />

          <Button
            color="blue"
            fullWidth
            mt="md"
            radius="md"
            disabled={!!Object.keys(form.errors).length}
          >
            Create Organization
          </Button>
        </Card>
      </Box>
    </Center>
  );
}
