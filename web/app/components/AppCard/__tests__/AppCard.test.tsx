import { describe, test, expect } from "vitest";
import { AppCard, AppCardProps } from "../index";

import { render } from "~/utils/testing-utils/render";

import { screen, fireEvent } from "@testing-library/react";
import { navigateMock } from "__mocks__/@remix-run";

describe("<AppCard />", () => {
  const defaultProps: AppCardProps = {
    id: "hello",
    name: "Sample App",
    description: "This is a sample app description.",
    isAdmin: false,
    link: "/sample-app",
    deleteLink: "/delete-sample-app",
  };

  test("Displays the app name and description", () => {
    render(<AppCard {...defaultProps} />);
    expect(screen.getByText("Sample App")).toBeInTheDocument();
    expect(
      screen.getByText("This is a sample app description.")
    ).toBeInTheDocument();
  });

  test("Renders the 'Go To App' button", () => {
    render(<AppCard {...defaultProps} />);
    const goToAppButton = screen.getByRole("button", { name: /go to app/i });
    expect(goToAppButton).toBeInTheDocument();
  });

  test("Navigates to the app link on 'Go To App' button click", () => {
    render(<AppCard {...defaultProps} />);
    const goToAppButton = screen.getByRole("button", { name: /go to app/i });

    fireEvent.click(goToAppButton);
    expect(navigateMock).toHaveBeenCalledWith("/sample-app");
  });

  test("Does not render the delete button when isAdmin is false", () => {
    render(<AppCard {...defaultProps} />);
    expect(
      screen.queryByRole("button", { name: /delete/i })
    ).not.toBeInTheDocument();
  });
});
