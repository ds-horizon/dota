import { Flex, Button, Text } from "@mantine/core";
import { BaseDeleteProps } from "..";

type DeleteUserProps = BaseDeleteProps;

export const DeleteUser = ({ onSuccess }: DeleteUserProps) => {
  return (
    <>
      <Text>Are you sure you want to delete your account ?</Text>
      <Flex justify={"flex-end"} mt={"lg"}>
        <Button color="red" onClick={onSuccess}>
          Delete
        </Button>
      </Flex>
    </>
  );
};
