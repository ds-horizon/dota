import { Flex, Button, Text } from "@mantine/core";
import { BaseDeleteProps } from "..";
import { useSearchParams } from "@remix-run/react";
import { useDeleteOrg } from "../hooks/useDeleteOrg";

type DeleteOrgProps = BaseDeleteProps;

export const DeleteOrg = ({ onSuccess }: DeleteOrgProps) => {
  const { mutate } = useDeleteOrg();
  const [searchParams] = useSearchParams();

  const onDelete = () => {
    mutate(
      {
        tenant: searchParams.get("id") ?? "",
      },
      {
        onSuccess: onSuccess,
      }
    );
  };

  return (
    <>
      <Text>
        Are you sure you want to delete this orgainisation (
        {searchParams.get("name") ?? ""})?
      </Text>
      <Flex justify={"flex-end"} mt={"lg"}>
        <Button color="red" onClick={onDelete}>
          Delete
        </Button>
      </Flex>
    </>
  );
};
