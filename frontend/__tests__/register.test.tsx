import { render, screen, fireEvent } from "@testing-library/react";
import RegisterPage from "@/app/register/page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

// Mock @/lib/api
jest.mock("@/lib/api", () => ({
  todoApi: {
    register: jest.fn(),
  },
}));

// Mock @/components/ChatBot
jest.mock("@/components/ChatBot", () => {
  return function MockChatBot() {
    return null;
  };
});

describe("RegisterPage", () => {
  it("renders the registration form", () => {
    render(<RegisterPage />);
    expect(screen.getByText("TaskFlow Pro")).toBeInTheDocument();
    expect(screen.getByText("Create your account")).toBeInTheDocument();
    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Create Account/i })
    ).toBeInTheDocument();
  });

  it("renders the login link", () => {
    render(<RegisterPage />);
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  it("allows typing in all fields", () => {
    render(<RegisterPage />);
    const emailInput = screen.getByLabelText("Email Address");
    const passwordInput = screen.getByLabelText("Password");
    const confirmInput = screen.getByLabelText("Confirm Password");

    fireEvent.change(emailInput, { target: { value: "new@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "pass123" } });
    fireEvent.change(confirmInput, { target: { value: "pass123" } });

    expect(emailInput).toHaveValue("new@example.com");
    expect(passwordInput).toHaveValue("pass123");
    expect(confirmInput).toHaveValue("pass123");
  });
});
