import cx from "clsx";
import {
  Table,
  Checkbox,
  Group,
  Avatar,
  NativeSelect,
  Text,
} from "@mantine/core";
import { useParams } from "@remix-run/react";
import { Collaborator } from "../data/getAppCollaborator";
import { useUpdateCollabarator } from "../hooks/useUpdateCollabarator";

import classes from "../index.module.css";

type CollabaratorRow = {
  data: Collaborator;
  selected: boolean;
  toggleSelection: (name: string) => void;
  refetch: () => void;
};

export const CollboratorRow = ({
  data,
  selected,
  toggleSelection,
  refetch,
}: CollabaratorRow) => {
  const { mutate, isLoading } = useUpdateCollabarator();
  const params = useParams();
  const accessTypes: Array<Collaborator["permission"]> = [
    "Owner",
    "Collaborator",
  ];
  return (
    <Table.Tr
      key={data.name}
      className={cx({ [classes.rowSelected]: selected })}
    >
      <Table.Td>
        <Checkbox
          checked={selected}
          onChange={() => toggleSelection(data.name)}
          disabled={isLoading}
        />
      </Table.Td>
      <Table.Td>
        <Group gap="sm">
          <Avatar size={26} radius={26} name={data.name} />
          <Text size="sm" fw={500}>
            {data.name}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <NativeSelect
          value={data.permission}
          data={accessTypes}
          disabled={isLoading}
          onChange={(event) => {
            mutate(
              {
                appId: params.app ?? "",
                tenant: params.org ?? "",
                email: data.name,
                role:
                  (event.target.value as Collaborator["permission"]) ??
                  "Collaborator",
              },
              {
                onSuccess: refetch,
              }
            );
          }}
        />
      </Table.Td>
    </Table.Tr>
  );
};
