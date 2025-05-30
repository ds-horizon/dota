import { rem, Tabs } from "@mantine/core";
import { IconPhoto, IconSettings } from "@tabler/icons-react";
import { CollabaratorList } from "~/components/Pages/components/CollaboratorList";
import { DeploymentList } from "~/components/Pages/DeploymentList";
import { useParams } from "@remix-run/react";
import { useOrgContext } from "../context/OrgContext";

export default function AppDetails() {
  const iconStyle = { width: rem(12), height: rem(12) };
  const { app } = useParams();
  const { selectedOrg } = useOrgContext();

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--mantine-color-text)" }}>
          {selectedOrg?.orgName || "Unknown Org"} <span style={{ color: '#2563eb', fontWeight: 600 }}>/</span> {app}
        </div>
      </div>
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
    </div>
  );
}
