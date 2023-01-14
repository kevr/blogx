import { act, render, screen, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { createStore } from "../store";
import Layout from "../Layout";
import Post from "./Post";

global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

const mockPost = (title, content) => ({
  id: 1,
  author: {
    id: 999,
    url: "http://testserver/users/999/",
    name: "John Doe",
    username: "john",
    email: "john@example.org",
  },
  title: title,
  content: content,
  created: "2023-1-12T00:00:00Z",
  edited: "2023-1-12T00:30:00Z",
});

test("Post renders", async () => {
  const post = mockPost("Test Post", "Some test content.");

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
          <HelmetProvider>
            <Layout>
              <Post />
            </Layout>
          </HelmetProvider>
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
    await render(
      <Provider store={store}>
        <BrowserRouter>
          <HelmetProvider>
            <Post />
          </HelmetProvider>
        </BrowserRouter>
      </Provider>
    );
  });

  const errorElement = await screen.getByTestId("error");
  expect(errorElement).toBeInTheDocument();
});

test("Post renders markdown", async () => {
  const md = `# Heading

[a link](/path/to/something)
`;
  const post = mockPost("Markdown Post", md);

  global.fetch = jest.fn(() => {
    return {
      status: 200,
      json: () => post,
    };
  });

  jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: () => ({ id: "1" }),
    useRouteMatch: () => ({ url: "/posts/1" }),
  }));

  const store = createStore();
  const { container } = await act(async () => {
    return await render(
      <Provider store={store}>
        <BrowserRouter>
          <HelmetProvider>
            <Post />
          </HelmetProvider>
        </BrowserRouter>
      </Provider>
    );
  });

  const h1 = container.querySelector("h1");
  expect(h1.textContent).toBe("Heading");

  const a = container.querySelectorAll("a")[1];
  expect(a.textContent).toBe("a link");
  expect(a.getAttribute("href")).toBe("/path/to/something");
});
