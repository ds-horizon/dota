import { Text, Skeleton } from "@mantine/core";
import { useGetOrgList } from "./hooks/useGetOrgList";
import { LinksGroup, LinksGroupProps } from "~/components/NavbarLinksGroup";
import { useEffect, useMemo } from "react";
import { IconGauge } from "@tabler/icons-react";
import { route } from "routes-gen";
import { ACTION_EVENTS, actions } from "~/utils/event-emitter";

export function OrgListWithActions() {
  const { data, isLoading, isError, refetch } = useGetOrgList();

  useEffect(() => {
    actions.add(ACTION_EVENTS.REFETCH_ORGS, refetch);
  }, []);

  const parsedData: (LinksGroupProps & { id: string })[] = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.map((org) => {
      return {
        icon: IconGauge,
        label: org.orgName,
        id: org.id,
        initiallyOpened: false,
        links: [
          {
            label: "Apps",
            link: route("/dashboard/:org/apps", { org: org.id }),
          },
          // {
          //   label: "Manage",
          //   link: route("/dashboard/:org/manage", {
          //     org: org.id,
          //   }),
          // },
          {
            label: "Delete",
            link:
              route("/dashboard/delete") +
              `?type=org&id=${org.id}&name=${org.orgName}`,
          },
        ].filter((_item) => (org.isAdmin ? true : _item.label !== "Delete")),
      };
    });
  }, [data]);

  if (isLoading) {
    return (
      <>
        {Array(10)
          .fill("s")
          .map((_, index) => (
            <Skeleton key={index} width={"100%"} height={30} my={"md"} />
          ))}
      </>
    );
  }

  if (isError) {
    return <Text>Something Went Wrong!</Text>;
  }

  if (!data?.length) {
    return <Text>No Org Present</Text>;
  }

  return (
    <>
      {parsedData.map((item) => {
        return <LinksGroup {...item} key={`org-${item.id}`} />;
      })}
    </>
  );
}
