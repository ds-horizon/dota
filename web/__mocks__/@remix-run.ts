import { vi } from "vitest";

export const navigateMock = vi.fn();

//remix mocks
vi.mock("@remix-run/react", () => {
  return {
    ...vi.importActual("@remix-run/react"),
    useNavigate: () => navigateMock,
  };
});
