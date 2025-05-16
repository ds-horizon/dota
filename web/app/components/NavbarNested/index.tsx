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
        {/* Support Links */}
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <a
            href="/documentation"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}
          >
            Documentation
          </a>
          <a
            href="https://discord.gg/Sa6a5Scj"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}
          >
            Ask Question
          </a>
          <a
            href="https://github.com/dream-sports-labs/dota/issues"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}
          >
            Report Issue
          </a>
        </div>
      </div>
    </div>
  );
}
