import { Paper, Group, Center, Stack, Text } from "@mantine/core";
import { GoogleButton } from "~/components/GoogleButton";

type LoginProps = {
  onClickLogin: () => void;
};

export function LoginForm({ onClickLogin }: LoginProps) {
  return (
    <Center style={{ minHeight: "100vh" }}>
      <Paper
        radius="md"
        p="xl"
        withBorder
        shadow="md"
        style={{ width: "100%", maxWidth: 400 }}
      >
        <Stack align="center">
          <Text size="xl" fw={700}>
            Welcome to Codepush
          </Text>
          <Text size="sm">Instantly manage your app updates with ease.</Text>
          <Group grow mb="md" mt="md">
            <GoogleButton radius="xl" fullWidth onClick={onClickLogin}>
              Continue with Google
            </GoogleButton>
          </Group>
        </Stack>
      </Paper>
    </Center>
  );
}
