import {
  Card,
  Text,
  Group,
  Badge,
  Center,
  Stack,
  Button,
  Tooltip,
  Flex,
  Avatar,
  Skeleton,
  Progress,
  RingProgress,
} from "@mantine/core";
import {
  Icon,
  IconDeviceTablet,
  IconFocus2,
  IconRotate2,
} from "@tabler/icons-react";
import classes from "./index.module.css";
import { ReleaseListResponse } from "../ReleaseListForDeploymentTable/data/getReleaseListForDeployment";
import { useGetReleaseDataForDeployment } from "./hooks/useGetReleaseDataForDeployment";
import { formatDate } from "~/utils/formatDate";
import { ReleaseEditFormModal } from "../ReleaseEditForm";
import { useParams, useSearchParams } from "@remix-run/react";
import { PromoteReleaseForm } from "../PromoteReleaseForm";

type StatsObject = {
  icon: Icon;
  key: keyof ReleaseListResponse;
  label: string;
};

const stats: StatsObject[] = [
  { icon: IconDeviceTablet, key: "installed", label: "Installs" },
  { icon: IconRotate2, key: "downloaded", label: "Downloads" },
  { icon: IconFocus2, key: "targetVersions", label: "Target Versions" },
];

export type ReleaseDataCardProps = {
  id: string;
  onEditClick: () => void;
  onPromoteClick: () => void;
};

export function ReleaseDetailCard({
  id,
  onEditClick,
  onPromoteClick,
}: ReleaseDataCardProps) {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const { data, isError, isLoading, isFetching, refetch } =
    useGetReleaseDataForDeployment({
      label: id,
      deploymentName: searchParams.get("deployment") ?? "",
      appId: params.app ?? "",
    });

  if (isLoading || isFetching) {
    return <Skeleton h={"100%"} w={"100%"} mih={400} />;
  }

  if (isError) {
    return <Text>Something Went Wrong</Text>;
  }

  if (!data) {
    return <Text>No Data Found</Text>;
  }

  const adoptionPercentage = data.totalActive > 0 ? Math.floor((data.activeDevices / data.totalActive) * 100)  : 0;
  const rollbackPercentage = data.installed > 0 ? Math.floor((data.rollbacks / data.installed) * 100)  : 0;

  const features = stats.map((feature) => (
    <Center key={feature.key}>
      <feature.icon size="1.05rem" className={classes.icon} stroke={1.5} />
      <Group gap={8}>
        <Text>
          {feature.label}
        </Text>
        <Text style={{ cursor: "pointer" }} fw={700}>
            {"  "}{data[feature.key]}
        </Text>
      </Group>
    </Center>
  ));

  return (
    <Card withBorder radius="md" className={classes.card} data-autofocus>
      <Group justify="space-between" mt="md">
        <div>
          <Text fw={500}>{data.label}</Text>
          <Text fz="xs">
            {data.description}
          </Text>
        </div>
        <Badge variant="outline" color={data.status ? "green" : "gray"}>
          {data.status ? "Enabled" : "Disabled"}
        </Badge>
      </Group>

      <Card.Section className={classes.section} mt="md">
        <Text fz="sm" c="dimmed" className={classes.label}>
          Statistics
        </Text>

        <Stack align="flex-start" mt={16}>
          {features}
        </Stack>
      </Card.Section>

      <Card.Section className={classes.section} mt="md">
        <Text fz="sm" c="dimmed" className={classes.label}>
          Rollout
        </Text>
        <Tooltip label={data.rollout} withArrow color="blue">
          <Progress.Root size="xl">
            <Progress.Section value={data.rollout} />
          </Progress.Root>
        </Tooltip>
      </Card.Section>

      <Card.Section className={classes.section} mt="md">
        <Group gap={8} mb={-8}>
          <Stack align="left">
          <Text fz="sm" c="dimmed" className={classes.label}>
            Active
          </Text>
            <RingProgress
                  size = {250}
                  label={
                    <Stack>
                      <Text size="m" ta="center">
                      {adoptionPercentage}%
                      </Text>
                      <Text size="s" ta="center">
                        {data.activeDevices} of {data.totalActive}
                      </Text>
                    </Stack>
                  }
                  sections={[
                    { value: adoptionPercentage, color: 'cyan', tooltip: "Adoption" }
                  ]}
              />
          </Stack>
          <Stack align="right">
          <Text fz="sm" c="dimmed" className={classes.label}>
            RollBack
          </Text>
            <RingProgress
                  size = {250}
                  label={
                    <Stack>
                      <Text size="m" ta="center">
                      {rollbackPercentage}%
                      </Text>
                    </Stack>
                  }
                  sections={[
                    { value: rollbackPercentage, color: 'red', tooltip: "Rollback" }
                  ]}
              />
          </Stack>
        </Group>
      </Card.Section>


      <Card.Section className={classes.section}>
        <Flex justify={"space-between"}>
          <Flex align={"center"} style={{ cursor: "pointer" }}>
            <Tooltip withArrow label={data.releasedBy} color="blue">
              <Avatar
                key={data.releasedBy}
                name={data.releasedBy}
                color="initials"
              />
            </Tooltip>
            <Tooltip withArrow label={"Update Released Date"} color="blue">
              <Text
                fz="sm"
                c="dimmed"
                fw={500}
                style={{ lineHeight: 1 }}
                ml={3}
              >
                {formatDate(data.releasedAt)}
              </Text>
            </Tooltip>
          </Flex>
          <Group>
            <Button radius="xl" onClick={onEditClick}>
              Edit
            </Button>

            <Button radius="xl" onClick={onPromoteClick}>
              Promote
            </Button>
          </Group>
        </Flex>
      </Card.Section>
      <ReleaseEditFormModal data={data} refetch={refetch} />
      <PromoteReleaseForm release={data} refetch={refetch} />
    </Card>
  );
}
