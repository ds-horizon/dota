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
import { useUploadRelease } from "./hooks/useUploadRelease";
import { notifications } from "@mantine/notifications";
import React, { useState } from "react";

type ReleaseUploadFormProps = {
  opened: boolean;
  onClose: () => void;
  refetch: () => void;
  deploymentName: string;
  appId: string;
};

export function ReleaseUploadForm({ opened, onClose, refetch, deploymentName, appId }: ReleaseUploadFormProps) {
  const { mutate, isLoading } = useUploadRelease();

  const form = useForm({
    initialValues: {
      targetVersions: "",
      description: "",
      isDisabled: false,
      isMandatory: false,
      rollout: 100,
    },
    validate: {
      targetVersions: (value) => (!value ? "Target versions are required" : null),
      description: (value) => (!value ? "Description is required" : null),
    },
  });

  // State to store the selected file
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Handler for file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setSelectedFile(file || null);
  };

  // Submission handler
  const handleSubmit = async () => {
    if (!selectedFile || !deploymentName) {
      notifications.show({
        color: "red",
        title: "Error",
        message: "No .zip file selected or deployment missing.",
      });
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append("package", selectedFile, selectedFile.name); // field name must be "package"
    formData.append("targetVersions", form.values.targetVersions);
    formData.append("description", form.values.description);
    formData.append("isDisabled", String(form.values.isDisabled));
    formData.append("isMandatory", String(form.values.isMandatory));
    formData.append("rollout", String(form.values.rollout));

    mutate(
      {
        appId: appId ?? "",
        deploymentName: deploymentName ?? "",
        formData,
      },
      {
        onSuccess: () => {
          notifications.show({
            color: "green",
            title: "Success",
            message: "Release uploaded successfully",
          });
          refetch();
          onClose();
          form.reset();
          setSelectedFile(null);
        },
      }
    );
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Upload Release"
      centered
      size="xl"
    >
      {isLoading && <Overlay color="gray" backgroundOpacity={0.3} />}
      <Box mt="md">
        <label>
          <Text>Release .zip File</Text>
          <input
            type="file"
            accept=".zip"
            onChange={handleFileChange}
            style={{ display: "block", marginTop: 8 }}
          />
        </label>
        {selectedFile && (
          <Text size="sm" mt={4}>
            {selectedFile.name}
          </Text>
        )}
      </Box>
      <TextInput
        mt="md"
        label="Target Versions"
        placeholder="e.g. 1.0.0, 1.0.1"
        {...form.getInputProps("targetVersions")}
      />
      <Textarea
        mt="md"
        label="Description"
        placeholder="Describe your release"
        {...form.getInputProps("description")}
      />
      <Switch
        label="Disabled"
        checked={form.values.isDisabled}
        {...form.getInputProps("isDisabled")}
        mt="md"
        style={{ width: "fit-content" }}
      />
      <Switch
        label="Mandatory"
        checked={form.values.isMandatory}
        {...form.getInputProps("isMandatory")}
        mt="md"
        style={{ width: "fit-content" }}
      />
      <Box mt="md">
        <Text size="md">Rollout ({form.values.rollout}%)</Text>
        <Slider
          value={form.values.rollout}
          max={100}
          onChange={(value) => form.setFieldValue("rollout", value)}
        />
      </Box>
      <Group justify="flex-end" mt="xl">
        <Button
          onClick={handleSubmit}
          disabled={!selectedFile || !!Object.keys(form.errors).length}
          loading={isLoading}
        >
          Upload
        </Button>
      </Group>
    </Modal>
  );
} 