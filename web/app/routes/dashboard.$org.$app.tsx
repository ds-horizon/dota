import { rem, Tabs } from "@mantine/core";
import { IconPhoto, IconSettings } from "@tabler/icons-react";
import { CollabaratorList } from "~/components/Pages/components/CollaboratorList";
import { DeploymentList } from "~/components/Pages/DeploymentList";

export default function AppDetails() {
  const iconStyle = { width: rem(12), height: rem(12) };
  return (
    <Tabs defaultValue="Deployments">
      <Tabs.List>
        <Tabs.Tab
          value="Deployments"
          leftSection={<IconPhoto style={iconStyle} />}
        >
          Deployments
        </Tabs.Tab>
        <Tabs.Tab
          value="Collaborators"
          leftSection={<IconSettings style={iconStyle} />}
        >
          Collaborators
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="Deployments" mt={"md"}>
        <DeploymentList />
      </Tabs.Panel>
      <Tabs.Panel value="Collaborators" mt={"md"}>
        <CollabaratorList />
      </Tabs.Panel>
    </Tabs>
  );
}
