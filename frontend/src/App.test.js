import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders login link", () => {
  render(<App />);
  const loginElement = screen.getByText(/Login/i);
  expect(loginElement).toBeInTheDocument();
});
