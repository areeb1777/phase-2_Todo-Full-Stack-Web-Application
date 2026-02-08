import { render, screen } from "@testing-library/react";
import EmptyState from "@/components/EmptyState";

describe("EmptyState", () => {
  it("renders the empty state message", () => {
    render(<EmptyState />);
    expect(screen.getByText("No tasks yet")).toBeInTheDocument();
    expect(
      screen.getByText("Add your first task to get started")
    ).toBeInTheDocument();
  });
});
