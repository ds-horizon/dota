import { UserButton, UserButtonProps } from "../UserButton";
import classes from "./index.module.css";
import { OrgListWithActions } from "../Pages/components/OrgListNavbar";

export function NavbarNested({ user }: UserButtonProps) {
  return (
    <div className={classes.navbar}>
      <div className={classes.linksInner}>
        <OrgListWithActions />
      </div>
      <div className={classes.footer}>
        <UserButton user={user} />
      </div>
    </div>
  );
}
