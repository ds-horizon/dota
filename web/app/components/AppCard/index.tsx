import { Card, Avatar, Text, Button, Flex } from "@mantine/core";
import classes from "./index.module.css";
import { useNavigate } from "@remix-run/react";
import { AppCardResponse } from "../Pages/components/AppList/data/getAppListForOrg";
import { IconTrash } from "@tabler/icons-react";

export type AppCardProps = Omit<AppCardResponse, "role"> & {
  link: string;
  deleteLink: string;
};

export function AppCard({
  name,
  description,
  link,
  deleteLink,
  isAdmin,
}: AppCardProps) {
  const navigate = useNavigate();

  return (
    <Card withBorder padding="xl" radius="md" className={classes.card}>
      <Card.Section h={100} />
      <Avatar
        key={name}
        name={name}
        color="initials"
        size={80}
        radius={80}
        mx="auto"
        mt={-30}
        className={classes.avatar}
      />
      <Text ta="center" fz="lg" fw={500} mt="sm">
        {name}
      </Text>
      <Text ta="center" fz="sm" c="dimmed">
        {description}
      </Text>
      {/* <Group mt="md" justify="center" gap={30}>
        {items}
      </Group> */}
      <Flex justify={"space-between"} align={"center"}>
        <Button
          fullWidth
          radius="md"
          mt="xl"
          size="md"
          onClick={() => {
            navigate(link);
          }}
        >
          Go To App
        </Button>
        {isAdmin && (
          <Button
            radius="md"
            mt="xl"
            mx={"sm"}
            size="md"
            onClick={() => {
              navigate(deleteLink);
            }}
            color="red"
            variant="light"
          >
            <IconTrash />
          </Button>
        )}
      </Flex>
    </Card>
  );
}
