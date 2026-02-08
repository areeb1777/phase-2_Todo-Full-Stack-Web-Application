import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "@/app/login/page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

// Mock @/lib/api
jest.mock("@/lib/api", () => ({
  todoApi: {
    login: jest.fn(),
  },
}));

// Mock @/components/ChatBot
jest.mock("@/components/ChatBot", () => {
  return function MockChatBot() {
    return null;
  };
});

describe("LoginPage", () => {
  it("renders the login form", () => {
    render(<LoginPage />);
    expect(screen.getByText("TaskFlow Pro")).toBeInTheDocument();
    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });

  it("renders the register link", () => {
    render(<LoginPage />);
    expect(screen.getByText("Create Account")).toBeInTheDocument();
  });

  it("allows typing in email and password fields", () => {
    render(<LoginPage />);
    const emailInput = screen.getByLabelText("Email Address");
    const passwordInput = screen.getByLabelText("Password");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });
});
