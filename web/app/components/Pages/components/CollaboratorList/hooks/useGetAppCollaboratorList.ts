import { useQuery } from "react-query";
import { getAppCollaboratorList } from "../data/getAppCollaborator";
import { useParams } from "@remix-run/react";

export const useGetAppCollaboratorList = () => {
  const params = useParams();
  return useQuery(
    [`${params.app}-${params.org}-Collaborator-list`], // Use an array for the query key
    () =>
      getAppCollaboratorList({
        appId: params.app ?? "",
        tenant: params.org ?? "",
      }),
    {
      retry: 1,
    }
  );
};
