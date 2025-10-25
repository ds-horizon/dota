import { UserButton, UserButtonProps } from "../UserButton";
import classes from "./index.module.css";
import { OrgListWithActions } from "../Pages/components/OrgListNavbar";
import { useState } from "react";

const SupportButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const supportLinks = [
    {
      label: "Documentation",
      href: "https://dota.dreamsportslabs.com/documentation/introduction",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      ),
    },
    {
      label: "Ask Question",
      href: "https://discord.gg/tUpDV8EaDM",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      ),
    },
    {
      label: "Report Issue",
      href: "https://github.com/ds-horizon/dota/issues",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      ),
    },
  ];

  return (
    <div className={classes.supportContainer}>
      <button
        className={classes.supportButton}
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <span>Support</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      
      {isOpen && (
        <div className={classes.dropdownMenu}>
          {supportLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={classes.dropdownItem}
            >
              {link.icon}
              <span>{link.label}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export function NavbarNested({ user }: UserButtonProps) {
  return (
    <div className={classes.navbar}>
      <div className={classes.linksInner}>
        <OrgListWithActions />
      </div>
      <div className={classes.footer}>
        <UserButton user={user} />
        <SupportButton />
      </div>
    </div>
  );
}
