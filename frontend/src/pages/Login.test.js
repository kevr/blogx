import { render, screen } from "@testing-library/react";
import Login from "./Login";

test("renders login page", () => {
  render(<Login />);
  const element = screen.getByText(/Login/i);
  expect(element).toBeInTheDocument();
});
