import { act, render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Login from "./Login";
import { createStore } from "../store";

// Default fetch() mock as a failure. Without this, we must check
// for jest's mock within beforeEach, and that's just annoying.
global.fetch = jest.fn(() =>
  Promise.resolve({
    status: 500,
  })
);

const storage = global.localStorage;

beforeEach(() => {
  fetch.mockClear();
});

afterEach(() => {
  global.localStorage = storage;
});

test("renders login page", () => {
  const store = createStore();
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </Provider>
  );

  const usernameInput = screen.getByTestId("login-username");
  expect(usernameInput).toBeInTheDocument();

  const passwordInput = screen.getByTestId("login-password");
  expect(passwordInput).toBeInTheDocument();

  const submit = screen.getByTestId("login-submit");
  expect(submit).toBeInTheDocument();
});

test("can login", async () => {
  // Mock fetch to return an OK
  global.fetch = jest.fn((_, options) => {
    expect(options.body).toBe(
      JSON.stringify({ username: "test", password: "test_password" })
    );
    return Promise.resolve({
      status: 200,
      json: () => {
        return {
          access: "access_token",
          refresh: "refresh_token",
        };
      },
    });
  });

  global.localStorage = {
    setItem: (key, value) => {
      expect(key).toBe("session");
      expect(JSON.parse(value)).toBe({
        username: "test",
        access: "access_token",
        refresh: "refresh_token",
      });
    },
  };

  const store = createStore();
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </Provider>
  );

  await act(async () => {
    const usernameInput = screen.getByTestId("login-username");
    await fireEvent.input(usernameInput, { target: { value: "test" } });

    const passwordInput = screen.getByTestId("login-password");
    await fireEvent.input(passwordInput, {
      target: { value: "test_password" },
    });

    const submit = screen.getByTestId("login-submit");
    await fireEvent(submit, new MouseEvent("click"));
  });

  expect(fetch).toHaveBeenCalledTimes(1);
});

test("failed login", async () => {
  global.fetch = jest.fn(() => {
    return Promise.resolve({
      status: 401,
    });
  });

  const store = createStore();
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </Provider>
  );

  await act(async () => {
    const submit = screen.getByTestId("login-submit");
    await fireEvent(submit, new MouseEvent("click"));
  });

  expect(fetch).toHaveBeenCalledTimes(1);
});
