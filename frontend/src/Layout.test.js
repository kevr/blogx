import { act, render, screen, within, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { createStore } from "./store";
import Layout from "./Layout";
import config from "./config.json";

global.fetch = jest.fn(() =>
  Promise.resolve({
    status: 200,
  })
);

global.setInterval = jest.fn(() => {});

beforeEach(() => {
  fetch.mockClear();
  setInterval.mockClear();
});

test("Redux title usage", async () => {
  const store = createStore();

  store.dispatch({ type: "SET_TITLE", title: "Test" });

  await act(() => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <HelmetProvider>
            <Layout>
              <span>Fake child</span>
            </Layout>
          </HelmetProvider>
        </BrowserRouter>
      </Provider>
    );
  });

  // The title we set in Redux
  const customTitle = "Test";

  // Look for it as text within the data-testid="page-title" element
  const { getByText } = within(await screen.getByTestId("page-title"));
  expect(getByText(customTitle)).toBeInTheDocument();

  // Also, look for it in <title> via document.title
  const title = `${config.appTitle} - ${customTitle}`;
  await waitFor(() => expect(document.title).toEqual(title));
});

test("apiInterval", async () => {
  fetch.mockImplementationOnce(() => {
    return Promise.resolve({
      status: 200,
      json: () => {
        return Promise.resolve({
          access: "new_access_token",
          refresh: "new_refresh_token",
        });
      },
    });
  });

  setInterval.mockImplementationOnce((fn, ms) => {
    fn();
  });
  jest.spyOn(global, "setInterval");

  const store = createStore();
  store.dispatch({
    type: "SET_SESSION",
    session: {
      username: "test",
      access: "test_access",
      refresh: "test_refresh",
    },
  });

  await act(async () => {
    await render(
      <Provider store={store}>
        <BrowserRouter>
          <HelmetProvider>
            <Layout>
              <span>Fake child</span>
            </Layout>
          </HelmetProvider>
        </BrowserRouter>
      </Provider>
    );
  });

  expect(setInterval).toBeCalledTimes(2);
});
