import { rem, Tabs } from "@mantine/core";
import { IconPhoto, IconSettings } from "@tabler/icons-react";
import { CollabaratorList } from "~/components/Pages/components/CollaboratorList";
import { DeploymentList } from "~/components/Pages/DeploymentList";
import { useLocation, useParams } from "@remix-run/react";
import { useEffect, useState } from "react";

export default function AppDetails() {
  const iconStyle = { width: rem(12), height: rem(12) };
  const { app, org } = useParams();
  const location = useLocation();
  const [orgName, setOrgName] = useState(location.state?.orgName);

  useEffect(() => {
    if (!orgName) {
      fetch("/api/v1/tenants")
        .then(res => res.json())
        .then(data => {
          const found = data.organisations?.find((o: any) => o.id === org);
          setOrgName(found?.displayName);
        });
    }
  }, [org, orgName]);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--mantine-color-text)" }}>
          {orgName || "Unknown Org"} <span style={{ color: '#2563eb', fontWeight: 600 }}>/</span> {app}
        </div>
        <div style={{ fontSize: 14, color: "var(--mantine-color-dimmed)", marginTop: 2 }}>
          Tenant &nbsp; &nbsp; &nbsp; &nbsp; App
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
