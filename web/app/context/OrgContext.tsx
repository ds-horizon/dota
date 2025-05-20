import { createContext, useContext } from "react";

export type Organization = {
  id: string;
  orgName: string;
  isAdmin: boolean;
};

export const OrgContext = createContext<{
  selectedOrg: Organization | null;
  setSelectedOrg: (org: Organization | null) => void;
  orgList: Organization[];
  setOrgList: (orgs: Organization[]) => void;
}>({
  selectedOrg: null,
  setSelectedOrg: () => {},
  orgList: [],
  setOrgList: () => {},
});

export const useOrgContext = () => useContext(OrgContext); 