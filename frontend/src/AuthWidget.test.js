import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { createStore } from "./store";
import AuthWidget from "./AuthWidget";

global.fetch = jest.fn(() =>
  Promise.resolve({
    status: 500,
  })
);

const storageGet = Storage.prototype.getItem;
const storageSet = Storage.prototype.setItem;

beforeEach(() => {
  fetch.mockClear();
});

afterEach(() => {
  Storage.prototype.getItem = storageGet;
  Storage.prototype.setItem = storageSet;
});

test("session persistence", async () => {
  const debug = jest.spyOn(console, "debug");

  Storage.prototype.getItem = (key) =>
    JSON.stringify({
      username: "test",
      access: "test_access",
      refresh: "test_refresh",
    });

  global.fetch = jest.fn(() => Promise.resolve({ status: 200 }));

  const store = createStore();
  await act(async () => {
    await render(
      <Provider store={store}>
        <BrowserRouter>
          <AuthWidget />
        </BrowserRouter>
      </Provider>
    );
  });

  expect(debug).toHaveBeenCalledWith("Session validated");
});

test("session logout", async () => {
  Storage.prototype.getItem = (key) =>
    JSON.stringify({
      username: "test",
      access: "test_access",
      refresh: "test_refresh",
    });

  global.fetch = jest.fn(() => Promise.resolve({ status: 200 }));

  const store = createStore();
  await act(async () => {
    await render(
      <Provider store={store}>
        <BrowserRouter>
          <AuthWidget />
        </BrowserRouter>
      </Provider>
    );
  });

  const logout = screen.getByText("Logout");
  await act(async () => {
    await fireEvent.click(logout);
  });
});

test("session refresh", async () => {
  console.log("FAIL INCOMING");
  const debug = jest.spyOn(console, "debug");

  Storage.prototype.getItem = jest
    .fn()
    .mockImplementationOnce(() =>
      JSON.stringify({
        username: "test",
        access: "test_access",
        refresh: "test_refresh",
      })
    )
    .mockImplementationOnce(() =>
      JSON.stringify({
        username: "test",
        access: "new_access_token",
        refresh: "test_refresh",
      })
    );

  Storage.prototype.setItem = (key, value) => {
    expect(key).toBe("session");
    expect(JSON.parse(value)).toStrictEqual({
      username: "test",
      access: "new_access_token",
      refresh: "test_refresh",
    });
  };

  global.fetch = jest
    .fn()
    .mockImplementationOnce((_, options) => {
      // status
      return Promise.resolve({ status: 401 });
    })
    .mockImplementationOnce((_, options) => {
      // refresh
      return Promise.resolve({
        status: 200,
        json: () => {
          return {
            access: "new_access_token",
          };
        },
      });
    })
    .mockImplementationOnce((_, options) => {
      return Promise.resolve({ status: 200 });
    });

  const store = createStore();
  await act(async () => {
    await render(
      <Provider store={store}>
        <BrowserRouter>
          <AuthWidget />
        </BrowserRouter>
      </Provider>
    );
  });

  expect(debug).toHaveBeenCalledWith("Session refreshed");
});

test("session expired", async () => {
  const err = jest.spyOn(console, "error");

  Storage.prototype.getItem = (key) =>
    JSON.stringify({
      username: "test",
      access: "test_access",
      refresh: "test_refresh",
    });

  Storage.prototype.setItem = (key, value) => {
    expect(key).toBe("session");
    expect(value).toBe("null");
  };

  global.fetch = jest.fn(() => Promise.resolve({ status: 401 }));

  const store = createStore();
  await act(async () => {
    await render(
      <Provider store={store}>
        <BrowserRouter>
          <AuthWidget />
        </BrowserRouter>
      </Provider>
    );
  });

  expect(err).toHaveBeenCalledWith("Session expired");
});
