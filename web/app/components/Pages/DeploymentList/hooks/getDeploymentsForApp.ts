import { useParams } from "@remix-run/react";
import { useQuery } from "react-query";
import { getDeploymentsForApp } from "../data/getDeploymentsForApp";

export const useGetDeploymentsForApp = () => {
  const params = useParams();

  return useQuery(`${params.org}-${params.app}-deployment-list`, () =>
    getDeploymentsForApp(params.app ?? "")
  );
};
