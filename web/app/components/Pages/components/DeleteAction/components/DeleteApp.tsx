import { Flex, Button, Text } from "@mantine/core";
import { useDeleteAppForOrg } from "../hooks/useDeleteAppForOrg";
import { useSearchParams } from "@remix-run/react";
import { BaseDeleteProps } from "..";

type DeleteAppProps = BaseDeleteProps;

export const DeleteApp = ({ onSuccess }: DeleteAppProps) => {
  const { mutate, isLoading } = useDeleteAppForOrg();
  const [searchParams] = useSearchParams();

  const appName = searchParams.get("app") ?? "";

  const onDeleteClick = () => {
    mutate(
      {
        tenant: searchParams.get("tenant") ?? "",
        appId: searchParams.get("app") ?? "",
      },
      {
        onSuccess: onSuccess,
      }
    );
  };

  return (
    <>
      <Text>Are you sure you want to delete this app ({appName})?</Text>
      <Flex justify={"flex-end"} mt={"lg"}>
        <Button color="red" loading={isLoading} onClick={onDeleteClick}>
          Delete
        </Button>
      </Flex>
    </>
  );
};
