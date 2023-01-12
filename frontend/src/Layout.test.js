import { act, render, screen, within, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { createStore } from "./store";
import Layout from "./Layout";
import config from "./config.json";

test("Redux title usage", async () => {
  const store = createStore();

  store.dispatch({ type: "SET_TITLE", title: "Test" });

  await act(() => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Layout>
            <span>Fake child</span>
          </Layout>
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
