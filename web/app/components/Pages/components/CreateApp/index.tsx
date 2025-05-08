import { useForm } from "@mantine/form";
import {
  Button,
  Group,
  TextInput,
  Autocomplete,
  TagsInput,
  Skeleton,
} from "@mantine/core";
import { useGetOrgList } from "../OrgListNavbar/hooks/useGetOrgList";
import { useCreateApp } from "./hooks/useCreateApp";
import { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";
import { route } from "routes-gen";
import { ACTION_EVENTS, actions } from "~/utils/event-emitter";

export function CreateAppForm() {
  const { mutate, isLoading } = useCreateApp();
  const navigation = useNavigate();
  const orgs = useGetOrgList();
  const [org, setOrg] = useState({
    value: "",
    error: "",
  });

  const form = useForm<{ appName: string }>({
    mode: "uncontrolled",
    validateInputOnChange: true,
    initialValues: {
      appName: "",
    },

    validate: {
      appName: (value) => {
        return value.length ? null : "App Name  Can't be Empty";
      },
    },
  });

  const onOrgChange = (value: string) => {
    if (!value?.length) {
      setOrg({ value: "", error: "Owner Can't be Empty" });
      return;
    }

    setOrg({ value, error: "" });
  };

  const shouldShowLoader = orgs.isLoading || orgs.isFetching;

  useEffect(() => {
    setOrg({
      value: orgs.data?.[0]?.orgName ?? "Select Org",
      error: "",
    });
  }, [orgs.data]);

  return (
    <>
      <Skeleton visible={shouldShowLoader}>
        <TextInput
          label="App Name"
          placeholder="App Name"
          withAsterisk
          key={form.key("appName")}
          disabled={isLoading}
          {...form.getInputProps("appName")}
        />
      </Skeleton>
      <Skeleton visible={shouldShowLoader} mt={"md"}>
        <Autocomplete
          mt="md"
          label="Select an Owner"
          withAsterisk
          placeholder="Pick an owner"
          onChange={onOrgChange}
          disabled={isLoading}
          value={org.value}
          error={org.error}
          data={orgs.data?.map((item) => item.orgName) ?? []}
        />
      </Skeleton>

      {/* <Skeleton visible={shouldShowLoader} mt={"md"}>
        <TagsInput
          mt="md"
          label="Press Enter to submit a tag"
          placeholder="Enter tag"
          data={["Production", "Stage", "Dev", "Load"]}
          clearable
          disabled={isLoading}
        />
      </Skeleton> */}
      <Group justify="flex-end" mt="md">
        <Button
          onClick={() => {
            if (form.validate().hasErrors) {
              return;
            }
            let owner = { orgId: "", orgName: org.value };
            const _org = orgs.data?.filter(
              (item) => item.orgName === org.value
            );
            if (_org?.length) {
              owner = { orgId: _org[0].id, orgName: _org[0].orgName };
            }
            return mutate(
              {
                name: form.getValues().appName,
                ...owner,
              },
              {
                onSuccess: () => {
                  actions.trigger(ACTION_EVENTS.REFETCH_ORGS);
                  form.reset();
                  navigation(route("/dashboard"));
                },
              }
            );
          }}
          disabled={
            !!Object.keys(form.errors).length || isLoading || !!org.error.length
          }
          loading={isLoading}
        >
          Create
        </Button>
      </Group>
    </>
  );
}
