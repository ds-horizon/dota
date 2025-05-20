import {
  ActionIcon,
  Card,
  CopyButton,
  Flex,
  rem,
  Skeleton,
  Text,
  Tooltip,
  Button,
} from "@mantine/core";
import { useNavigate, useSearchParams } from "@remix-run/react";
import { DeploymentsSearch } from "../components/DeploymentsSearch";
import { useGetDeploymentsForApp } from "./hooks/getDeploymentsForApp";
import { IconCheck, IconCopy, IconSearch } from "@tabler/icons-react";
import { ReleaseListForDeploymentTable } from "../components/ReleaseListForDeploymentTable";
import { ReleaseDeatilCardModal } from "../components/ReleaseDetailCardModal";
import { useEffect } from "react";
import { Spotlight, SpotlightActionData, spotlight } from "@mantine/spotlight";

export const DeploymentList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetDeploymentsForApp();

  const details = data?.find(
    (item) => item.name === searchParams.get("deployment")
  );

  useEffect(() => {
    if (!searchParams.get("deployment")) {
      if (data) {
        setSearchParams((p) => {
          p.set("deployment", data?.[0]?.name ?? "Production");
          return p;
        });
      }
    }
  }, [data]);

  const spotlightActions: SpotlightActionData[] = data?.map((item) => ({
    id: item.id,
    label: item.name,
    description: `Deployment Key: ${item.deploymentKey}`,
    onClick: () => {
      setSearchParams((prev) => {
        prev.set("deployment", item.name);
        return prev;
      });
    },
    leftSection: (
      <IconSearch style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
    ),
  })) ?? [];

  return (
    <>
      <Spotlight
        actions={spotlightActions}
        nothingFound="No deployments found..."
        highlightQuery
        scrollable={spotlightActions.length > 5}
        shortcut={["mod + P"]}
        searchProps={{
          leftSection: (
            <IconSearch style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
          ),
          placeholder: "Search deployments...",
        }}
      />
      <Flex justify={"space-between"} align={"center"}>
        <Flex align="center" gap="md">
          {details && !isLoading ? (
            <Card
              withBorder
              radius="md"
              padding="sm"
              bg="var(--mantine-color-body)"
            >
              <Flex align={"center"}>
                <Text fz="md" tt="uppercase" fw={700}>
                  {details?.name}
                </Text>
                <CopyButton value={details.deploymentKey} timeout={2000}>
                  {({ copied, copy }) => (
                    <Tooltip
                      label={
                        copied
                          ? "Copied"
                          : `Copy Deployment Key (${details.deploymentKey})`
                      }
                      withArrow
                      position="right"
                      color={copied ? "teal" : "blue"}
                    >
                      <ActionIcon
                        color={copied ? "teal" : "gray"}
                        variant="subtle"
                        onClick={copy}
                        ml={"sm"}
                      >
                        {copied ? (
                          <IconCheck style={{ width: rem(16) }} />
                        ) : (
                          <IconCopy style={{ width: rem(16) }} />
                        )}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </CopyButton>
              </Flex>
            </Card>
          ) : isLoading ? (
            <Skeleton h={50} w={170} />
          ) : data?.length ? (
            <Text>Please Select a Deployment</Text>
          ) : (
            <Text>No Deployments Found</Text>
          )}
          <Button
            variant="light"
            leftSection={<IconSearch style={{ width: rem(16) }} />}
            onClick={() => spotlight.open()}
          >
            Search Deployments
          </Button>
        </Flex>
        <DeploymentsSearch data={data ?? []} refetch={refetch} />
      </Flex>
      <ReleaseListForDeploymentTable />
      <ReleaseDeatilCardModal
        id={searchParams.get("releaseId")}
        opened={!!searchParams.get("releaseId")}
        close={() => {
          navigate(-1);
        }}
        deploymentName={details?.name}
      />
    </>
  );
};
