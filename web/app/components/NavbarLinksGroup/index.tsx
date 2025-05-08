import { useEffect, useState } from "react";
import {
  Group,
  Box,
  Collapse,
  ThemeIcon,
  Text,
  UnstyledButton,
  rem,
  NavLink,
  Kbd,
} from "@mantine/core";
import { Icon, IconChevronRight } from "@tabler/icons-react";
import classes from "./index.module.css";
import { useLocation, useNavigate, useParams } from "@remix-run/react";

export interface LinksGroupProps {
  icon: Icon;
  label: string;
  initiallyOpened?: boolean;
  id: string;
  links?: { label: string; link: string }[];
}

export function LinksGroup({
  icon: Icon,
  label,
  initiallyOpened,
  links,
  id,
}: LinksGroupProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(
    initiallyOpened || false || params.org === id
  );

  useEffect(() => {
    setOpened(params.org === id);
  }, [id, params.org]);

  const items = (hasLinks ? links : []).map((link) => (
    <Text
      className={classes.link}
      key={id + link.label}
      onClick={() => navigate(link.link)}
    >
      <NavLink
        key={link.link}
        label={
          link.label === "Apps" ? (
            <Text>
              {link.label}
              <Kbd h={"fit-content"} ml={"sm"}>
                ⌘ K
              </Kbd>
            </Text>
          ) : (
            link.label
          )
        }
        variant="subtle"
        active={location.pathname === link.link}
      />
      {/* {link.label === "Apps" && <Kbd h={"fit-content"}>⌘ K</Kbd>} */}
    </Text>
  ));

  return (
    <>
      <UnstyledButton
        onClick={() => setOpened((o) => !o)}
        className={classes.control}
      >
        <Group justify="space-between" gap={0}>
          <Box style={{ display: "flex", alignItems: "center" }}>
            <ThemeIcon variant="light" size={30}>
              <Icon style={{ width: rem(18), height: rem(18) }} />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              style={{
                width: rem(16),
                height: rem(16),
                transform: opened ? "rotate(-90deg)" : "none",
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}
