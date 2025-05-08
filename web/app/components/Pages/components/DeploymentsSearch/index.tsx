import {
  createSpotlight,
  Spotlight,
  SpotlightActionData,
} from "@mantine/spotlight";
import {
  IconDashboard,
  IconDotsVertical,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { Box, Button, Menu, rem } from "@mantine/core";
import { useNavigate, useParams, useSearchParams } from "@remix-run/react";
import { CreateDeploymentForm } from "../CreateDeploymentForm";
import { useState } from "react";
import { DeploymentData } from "../../DeploymentList/data/getDeploymentsForApp";
import { useDeleteDeployment } from "./hooks/useDeleteDeployment";

const [deploymentSearch, deploymentSearchActions] = createSpotlight();

export type DeploymentsSearchProps = {
  data: DeploymentData[];
  refetch: () => void;
};

export const DeploymentsSearch = ({
  data,
  refetch,
}: DeploymentsSearchProps) => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const { mutate } = useDeleteDeployment();
  const navigate = useNavigate();

  const items: SpotlightActionData[] =
    data?.map((item) => {
      return {
        id: item.id,
        label: item.name,
        description: item.deploymentKey,
        onClick: () => {
          setSearchParams((prev) => {
            prev.set("deployment", item.name);
            return prev;
          });
        },
        leftSection: (
          <IconDashboard
            style={{ width: rem(24), height: rem(24) }}
            stroke={1.5}
          />
        ),
      };
    }) ?? [];

  return (
    <Box>
      <Menu>
        <Menu.Target>
          <Button
            rightSection={
              <IconDotsVertical style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Deployment
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            onClick={() => setOpen(true)}
            leftSection={
              <IconPlus style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Create
          </Menu.Item>
          <Menu.Item
            onClick={deploymentSearchActions.open}
            leftSection={
              <IconSearch style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Search
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              mutate(
                {
                  appId: params.app ?? "",
                  tenant: params.org ?? "",
                  deploymentName: searchParams.get("deployment") ?? "",
                },
                {
                  onSuccess: () => {
                    refetch();
                    navigate(-1);
                  },
                }
              );
            }}
            color="red"
            leftSection={
              <IconTrash style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Delete ({searchParams.get("deployment")})
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Spotlight
        store={deploymentSearch}
        actions={items}
        nothingFound="Nothing found..."
        highlightQuery
        scrollable={(data?.length ?? 0) > 5}
        shortcut={["mod + K"]}
        maxHeight={350}
        searchProps={{
          leftSection: (
            <IconSearch
              style={{ width: rem(20), height: rem(20) }}
              stroke={1.5}
            />
          ),
          placeholder: "Search...",
        }}
      />
      <CreateDeploymentForm
        open={open}
        onClose={() => {
          refetch();
          setOpen(false);
        }}
      />
    </Box>
  );
};
