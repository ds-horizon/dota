import { useState } from "react";
import { Table, Checkbox, ScrollArea, rem, Overlay } from "@mantine/core";

import { useGetAppCollaboratorList } from "./hooks/useGetAppCollaboratorList";

import { CollboratorRow } from "./components/CollboratorRow";
import { CollabaratorAction } from "./components/CollboratorAction";

export function CollabaratorList() {
  const { data, isLoading, isFetching, refetch } = useGetAppCollaboratorList();
  const [selection, setSelection] = useState<string[]>([]);
  const [disable, setDisable] = useState(false);

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
      return (
        <CollboratorRow
          key={item.name}
          data={item}
          selected={selection.includes(item.name)}
          toggleSelection={() => toggleRow(item.name)}
          refetch={refetch}
        />
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
      <CollabaratorAction
        selected={selection}
        refetch={refetch}
        setDisable={setDisable}
        disable={disable}
      />
      <ScrollArea mt={"sm"}>
        {disable && (
          <Overlay color="gray" backgroundOpacity={0.3} radius={"md"} />
        )}
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
