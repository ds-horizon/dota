import {
  AppShell,
  Burger,
  Button,
  Code,
  Flex,
  Group,
  Image,
  rem,
} from "@mantine/core";
import { NavbarNested } from "~/components/NavbarNested";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { Logo } from "~/components/Logo";
import { Outlet, useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { authenticateLoaderRequest } from "~/utils/authenticate";
import { User } from "~/.server/services/Auth/Auth.interface";
import { route } from "routes-gen";
import cpIcon from './../assets/images/second.png';
import { OrgContext, Organization } from "../context/OrgContext";
import { useGetOrgList } from "../components/Pages/components/OrgListNavbar/hooks/useGetOrgList";
import { useState, useEffect } from "react";
import { slugify } from "../utils/slugify";

export const loader = authenticateLoaderRequest();

export default function Hello() {
  const data = useLoaderData<User>();
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure();
  const openCreateApp = () => {
    navigate(route("/dashboard/create/app"));
  };
  useHotkeys([["C", openCreateApp]]);

  // Org context logic
  const { data: orgList = [] } = useGetOrgList();
  const params = useParams();
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [orgListState, setOrgList] = useState<Organization[]>([]);

  useEffect(() => {
    setOrgList(orgList);
  }, [orgList]);

  useEffect(() => {
    if (orgList.length && params.org) {
      const found = orgList.find((org) => slugify(org.orgName) === params.org);
      setSelectedOrg(found || null);
    }
  }, [orgList, params.org]);

  return (
    <OrgContext.Provider value={{ selectedOrg, setSelectedOrg, orgList: orgListState, setOrgList }}>
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
        padding="md"
      >
        <AppShell.Header>
          <Flex align={"center"} mt="sm">
            <Group h="100%" px="md" w={"100%"}>
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
              />
              <Group justify="space-between">
                <Image src={cpIcon} alt="DOTA" fit="contain" height={44}/>
                <Logo style={{ width: rem(80) }} />
                {/* <Code fw={700}>v{config.version}</Code> */}
              </Group>
            </Group>
            <Group mr="sm">
              <Button
                onClick={openCreateApp}
                rightSection={<Code fw={700}>C</Code>}
              >
                App
              </Button>
            </Group>
          </Flex>
        </AppShell.Header>
        <AppShell.Navbar style={{ overflow: "hidden" }}>
          <NavbarNested user={data} />
        </AppShell.Navbar>
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </OrgContext.Provider>
  );
}
