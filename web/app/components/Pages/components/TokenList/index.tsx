import cx from "clsx";
import { useState } from "react";
import {
  Table,
  Checkbox,
  ScrollArea,
  Group,
  Avatar,
  Text,
  rem,
  Flex,
  Button,
} from "@mantine/core";
import classes from "./index.module.css";
import { useGetAccessTokenList } from "./hooks/useGetAccessTokenList";
import { CreateTokenForm } from "~/components/Pages/components/CreateTokenForm";
import { useDeleteAccessToken } from "./hooks/useDeleteAccessToken";
import { notifications } from "@mantine/notifications";
import { handleApiError } from "~/utils/handleApiError";

type TokenActionProps = {
  selected: string[];
  refetch: () => void;
};

const TokenAction = ({ selected, refetch }: TokenActionProps) => {
  const { mutateAsync } = useDeleteAccessToken();
  const [open, setOpen] = useState(false);
  const numberOfSelected = selected.length;
  const [disable, setDisable] = useState(false);

  const onDelete = async () => {
    try {
      setDisable(true);
      const data = await Promise.allSettled(
        selected.map((item) => {
          return mutateAsync(
            {
              name: item,
            },
            {
              onError: (e) => {
                notifications.show({
                  color: "red",
                  title: `Collaborator Deletion ${item}`,
                  message: handleApiError(
                    e,
                    "Error While Removing Collaborator"
                  ),
                });
              },
            }
          );
        })
      );
      setDisable(false);

      const isFailed = data.filter((item) => item.status === "rejected");

      if (!isFailed) {
        notifications.show({
          color: "green",
          title: `Collaborator Deletion`,
          message: `${selected.join(",")}  collaborators removed successfully!`,
        });
      }
      refetch();
    } catch (e) {
      setDisable(false);
    }
  };

  return (
    <>
      <CreateTokenForm
        open={open}
        onClose={() => {
          setOpen(false);
          refetch();
        }}
      />
      <Flex align={"center"} justify={"space-between"}>
        <Text>
          {numberOfSelected ? `${numberOfSelected} rows selected` : "Tokens"}
        </Text>
        <Button
          color={numberOfSelected ? "red" : "blue"}
          loading={disable}
          onClick={() => {
            if (!numberOfSelected) {
              return setOpen(true);
            }
            onDelete();
          }}
        >
          {numberOfSelected ? `Delete ${numberOfSelected} Tokens` : "Add Token"}
        </Button>
      </Flex>
    </>
  );
};

export function AccessTokenList() {
  const { data, isLoading, isFetching, refetch } = useGetAccessTokenList();
  const [selection, setSelection] = useState<string[]>([]);

  const getRows = () => {
    if (isLoading || isFetching) {
      return (
        <Table.Tr key="no-data">
          <Table.Td colSpan={3}>Loading</Table.Td>
        </Table.Tr>
      );
    }

    if (!data?.length) {
      return (
        <Table.Tr key="no-data">
          <Table.Td colSpan={3}>No Data</Table.Td>
        </Table.Tr>
      );
    }

    return data?.map((item) => {
      const selected = selection.includes(item.name);
      return (
        <Table.Tr
          key={item.id}
          className={cx({ [classes.rowSelected]: selected })}
        >
          <Table.Td>
            <Checkbox
              checked={selection.includes(item.name)}
              onChange={() => toggleRow(item.name)}
            />
          </Table.Td>
          <Table.Td>
            <Group gap="sm">
              <Avatar size={26} radius={26} name={item.name} />
              <Text size="sm" fw={500}>
                {item.name}
              </Text>
            </Group>
          </Table.Td>
          <Table.Td>{item.role}</Table.Td>
        </Table.Tr>
      );
    });
  };

  const toggleRow = (id: string) =>
    setSelection((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );

  const toggleAll = () => {
    if (!data) return;
    setSelection((current) =>
      current.length === data.length ? [] : data.map((item) => item.name)
    );
  };

  const rows = getRows();

  return (
    <>
      <TokenAction
        selected={selection}
        refetch={() => {
          setSelection([]);
          refetch();
        }}
      />
      <ScrollArea>
        <Table w={"100%"} verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: rem(40) }}>
                <Checkbox
                  onChange={toggleAll}
                  checked={selection.length === data?.length}
                  indeterminate={
                    selection.length > 0 && selection.length !== data?.length
                  }
                />
              </Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Access</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </>
  );
}
