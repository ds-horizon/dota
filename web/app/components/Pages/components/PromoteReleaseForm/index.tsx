import { Autocomplete, Button, Flex, Modal } from "@mantine/core";
import { useSearchParams, useNavigate, useParams } from "@remix-run/react";
import { useGetDeploymentsForApp } from "../../DeploymentList/hooks/getDeploymentsForApp";
import { useState } from "react";
import { usePromoteRelease } from "./hooks/usePromoteRelease";
import { ReleaseListResponse } from "../ReleaseListForDeploymentTable/data/getReleaseListForDeployment";

export type PromoteReleaseFormProps = {
  release: ReleaseListResponse;
  refetch: () => void;
};

export const PromoteReleaseForm = ({
  release,
  refetch,
}: PromoteReleaseFormProps) => {
  const params = useParams();
  const { data } = useGetDeploymentsForApp();
  const { mutate, isLoading } = usePromoteRelease();
  const [value, setValue] = useState("");
  const [serachParams] = useSearchParams();
  const navigate = useNavigate();

  const close = () => {
    navigate(-1);
  };

  return (
    <Modal
      opened={
        !!serachParams.get("releaseId") &&
        !!serachParams.get("promote") &&
        serachParams.get("promote") === "true"
      }
      onClose={close}
      title="Promote Release"
      centered
      size={"lg"}
    >
      <Autocomplete
        data={data?.map((item) => item.name)}
        maxDropdownHeight={300}
        label="Select a deployment"
        placeholder="Search for deployment"
        value={value}
        onChange={(value) => setValue(value)}
      />
      <Flex justify={"flex-end"}>
        <Button
          mt={"md"}
          disabled={!value.length}
          loading={isLoading}
          onClick={() => {
            mutate(
              {
                sourceDeployment: serachParams.get("deployment") ?? "",
                targetDeployment: value,
                appVersion: release.targetVersions,
                label: release.label,
                appId: params.app ?? "",
                description: release.description,
                isDisabled: !release.status,
                isMandatory: release.mandatory,
                tenant: params.org ?? "",
              },
              {
                onSuccess: () => {
                  refetch();
                  close();
                },
              }
            );
          }}
        >
          Promote
        </Button>
      </Flex>
    </Modal>
  );
};
