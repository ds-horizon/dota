import { UnstyledButton, Group, Avatar, Text, rem, Menu } from "@mantine/core";
import {
  IconChevronRight,
  IconLogout,
  IconSettings,
  IconTrash,
} from "@tabler/icons-react";
import classes from "./index.module.css";
import { Form, useNavigate } from "@remix-run/react"; // Use Remix's Form for logout action
import { User } from "~/.server/services/Auth/Auth.interface";
import { route } from "routes-gen";

export type UserButtonProps = {
  user: User;
};

export function UserButton({ user }: UserButtonProps) {
  const navigate = useNavigate();
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <UnstyledButton className={classes.user}>
          <Group>
            <Avatar name={user.user.name} radius="xl" />
            <div style={{ flex: 1 }}>
              <Text size="sm" fw={500}>
                {user.user.name}
              </Text>
              <Text c="dimmed" size="xs">
                {user.user.email}
              </Text>
            </div>
            <IconChevronRight
              style={{ width: rem(14), height: rem(14) }}
              stroke={1.5}
            />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          color="red"
          leftSection={
            <IconTrash style={{ width: rem(14), height: rem(14) }} />
          }
          onClick={() => {
            navigate(route("/dashboard/delete") + "?type=Profile");
          }}
        >
          Delete Account
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item color="red">
          <Form
            method="post"
            action="/logout"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <IconLogout size={14} /> {/* Render the icon directly here */}
            <button
              type="submit"
              style={{
                all: "unset",
                cursor: "pointer",
                flex: 1,
                textAlign: "left",
              }}
            >
              Logout
            </button>
          </Form>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          leftSection={
            <IconSettings style={{ width: rem(14), height: rem(14) }} />
          }
          onClick={() => {
            navigate(route("/dashboard/tokens"));
          }}
        >
          Token List
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
