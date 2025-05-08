import { useForm } from "@mantine/form";
import {
  TextInput,
  Button,
  Group,
  Textarea,
  Modal,
  Switch,
  Slider,
  Text,
  Box,
  Flex,
  Tooltip,
  Overlay,
} from "@mantine/core";
import { ReleaseListResponse } from "../ReleaseListForDeploymentTable/data/getReleaseListForDeployment";
import { useNavigate, useParams, useSearchParams } from "@remix-run/react";
import { IconHelpOctagon } from "@tabler/icons-react";
import { useUpdateReleaseDataForDeployment } from "./hooks/useUpdateReleaseDataForDeployment";

type ReleaseEditProps = { data: ReleaseListResponse; refetch: () => void };

export function ReleaseEditFormModal({ data, refetch }: ReleaseEditProps) {
  const params = useParams();
  const { mutate, isLoading } = useUpdateReleaseDataForDeployment();
  const [serachParams] = useSearchParams();
  const navigate = useNavigate();

  const close = () => {
    navigate(-1);
  };
  const form = useForm<ReleaseEditProps["data"]>({
    mode: "uncontrolled",
    initialValues: data,
    validateInputOnChange: true,
    validate: {
      description: (value) => {
        return value.length ? null : "Description Can't be Empty";
      },
      targetVersions: (value) => {
        return value.length ? null : "Target Versions Can't be Empty";
      },
    },
  });

  const onSubmit = () => {
    const data = form.getValues();
    mutate(
      {
        appId: params.app ?? "",
        deploymentName: serachParams.get("deployment") ?? "",
        appVersion: data.targetVersions,
        description: data.description,
        isDisabled: !data.status,
        isMandatory: data.mandatory,
        label: data.label,
        rollout: data.rollout,
        tenant: params.org ?? "",
      },
      {
        onSuccess: () => {
          refetch();
          close();
        },
      }
    );
  };

  return (
    <Modal
      opened={
        !!serachParams.get("releaseId") &&
        !!serachParams.get("edit") &&
        serachParams.get("edit") === "true"
      }
      onClose={close}
      title="Edit Release Details"
      centered
      size={"xl"}
    >
      {isLoading && <Overlay color="gray" backgroundOpacity={0.3} />}
      <TextInput
        label="Label"
        placeholder="Label"
        key={form.key("label")}
        {...form.getInputProps("label")}
        disabled
      />
      <Textarea
        mt="md"
        label="Description"
        placeholder="Description"
        key={form.key("description")}
        {...form.getInputProps("description")}
      />
      <Textarea
        mt="md"
        label="Target Versions"
        placeholder="Target Versions"
        key={form.key("targetVersions")}
        {...form.getInputProps("targetVersions")}
      />
      <Switch
        label="Status"
        checked={form.getValues().status}
        {...form.getInputProps("status")}
        mt={"md"}
        style={{ width: "fit-content" }}
      />
      <Switch
        label="Mandatory"
        checked={form.getValues().mandatory}
        {...form.getInputProps("mandatory")}
        mt={"md"}
        style={{ width: "fit-content" }}
      />

      <Box mt={"md"}>
        <Flex align={"center"}>
          <Text size="md" style={{ cursor: "pointer" }} mr="sm">
            Rollout ({form.getValues().rollout}%)
          </Text>
          <Tooltip label={"Rollout Can't be Decreased"} color="blue" withArrow>
            <IconHelpOctagon size="1.05rem" stroke={1.5} />
          </Tooltip>
        </Flex>
        <Slider
          value={form.getValues().rollout}
          max={100}
          onChange={(value) => {
            if (value < data.rollout) {
              return;
            }
            form.setFieldValue("rollout", value);
          }}
        />
      </Box>

      <Group justify="flex-end" mt="xl">
        <Button
          onClick={onSubmit}
          disabled={!!Object.keys(form.errors).length}
          loading={isLoading}
        >
          Submit
        </Button>
      </Group>
    </Modal>
  );
}
