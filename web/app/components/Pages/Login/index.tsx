import { Paper, Group, Center, Stack, Text } from "@mantine/core";
import { GoogleButton } from "~/components/GoogleButton";
import { useEffect, useState } from "react";
import { env } from "~/.server/services/config";

type LoginProps = {
  onClickLogin: () => void;
};

export function LoginForm({ onClickLogin }: LoginProps) {
  const [useMockAuth, setUseMockAuth] = useState(false);
  
  // Check if Google credentials are missing
  useEffect(() => {
    // We can't directly access server-side env variables here,
    // so we'll check at login time whether to show a mock login message
    if (typeof window !== 'undefined') {
      // This is a client-side check only for UI purposes
      fetch('/api/v1/auth/status')
        .then(response => response.json())
        .then(data => {
          if (data.useMockAuth) {
            setUseMockAuth(true);
          }
        })
        .catch(error => {
          console.error('Error checking auth status:', error);
          // Assume we need mock auth if there's an error
          setUseMockAuth(true);
        });
    }
  }, []);
  
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
          
          {useMockAuth && (
            <Text size="sm" c="dimmed" mt="sm" mb="sm" ta="center">
              Using mock authentication (Google credentials not configured)
            </Text>
          )}
          
          <Group grow mb="md" mt="md">
            <GoogleButton radius="xl" fullWidth onClick={onClickLogin}>
              {useMockAuth ? "Continue with Mock Auth" : "Continue with Google"}
            </GoogleButton>
          </Group>
        </Stack>
      </Paper>
    </Center>
  );
}
