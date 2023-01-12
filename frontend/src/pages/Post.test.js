import { act, render, screen, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { createStore } from "../store";
import Layout from "../Layout";
import Post from "./Post";

global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

test("Post renders", async () => {
  const post = {
    id: 1,
    author: {
      id: 999,
      url: "http://testserver/users/999/",
      name: "John Doe",
      username: "john",
      email: "john@example.org",
    },
    title: "Test Post",
    content: "Some test content.",
    created: "2023-1-12T00:00:00Z",
    edited: "2023-1-12T00:30:00Z",
  };

  global.fetch = jest.fn(() => {
    return {
      status: 200,
      json: () => post,
    };
  });

  // https://stackoverflow.com/questions/58117890/how-to-test-components-using-new-react-router-hooks
  jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: () => ({ id: "1" }),
    useRouteMatch: () => ({ url: "/posts/1" }),
  }));

  const store = createStore();
  await act(async () => {
    await render(
      <Provider store={store}>
        <BrowserRouter>
          <Layout>
            <Post />
          </Layout>
        </BrowserRouter>
      </Provider>
    );
  });

  {
    const { getByText } = within(await screen.getByTestId("page-title"));
    expect(getByText(post.title)).toBeInTheDocument();
  }

  {
    const { getByText } = within(await screen.getByTestId("post-author"));
    expect(getByText(post.author.name)).toBeInTheDocument();
  }

  {
    const { getByText } = within(await screen.getByTestId("post-content"));
    expect(getByText(post.content)).toBeInTheDocument();
  }
});

test("Post renders error", async () => {
  global.fetch = jest.fn(() => {
    return {
      status: 500,
      json: () => {
        throw new Error("An exception");
      },
    };
  });

  jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: () => ({ id: "1" }),
    useRouteMatch: () => ({ url: "/posts/1" }),
  }));

  const store = createStore();
  await act(async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Post />
        </BrowserRouter>
      </Provider>
    );
  });

  const errorElement = await screen.getByTestId("error");
  expect(errorElement).toBeInTheDocument();
});
