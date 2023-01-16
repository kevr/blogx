import { createEvent } from "@testing-library/react";
import { act, render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import {
  BrowserRouter,
  createMemoryRouter,
  RouterProvider,
} from "react-router-dom";
import draftjs, { EditorState, ContentState } from "draft-js";
import { HelmetProvider } from "react-helmet-async";
import { createStore } from "../store";
import { Edit, Post } from "./index";
import { routes } from "../Routing";
import { mockPost } from "../Testing";

global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

test("Edit renders", async () => {
  const post = mockPost("Test Post", "Test content.");

  fetch.mockImplementationOnce(() => ({
    status: 200,
    json: () => Promise.resolve(post),
  }));

  const store = createStore();
  store.dispatch({
    type: "SET_SESSION",
    session: Object.assign(
      { access: "test_access", refresh: "test_refresh" },
      { username: post.author.username }
    ),
  });

  await act(async () => {
    await render(
      <Provider store={store}>
        <BrowserRouter>
          <HelmetProvider>
            <Edit />
          </HelmetProvider>
        </BrowserRouter>
      </Provider>
    );
  });

  const editor = screen.getByTestId("post-editor");
  expect(editor).toBeInTheDocument();

  const preview = screen.getByTestId("post-preview");
  expect(preview).toBeInTheDocument();
});

test("Edit cannot fetch post", async () => {
  const error = jest.spyOn(console, "error");
  const post = mockPost("Test Post", "Test content.");

  const store = createStore();
  store.dispatch({
    type: "SET_SESSION",
    session: {
      username: post.author.username,
      access: "test_access",
      refresh: "test_refresh",
    },
  });

  const router = createMemoryRouter(routes, {
    initialEntries: ["/posts/1/edit"],
  });

  // First fetch: /auth/status/
  // Second fetch: /posts/1/
  fetch
    .mockImplementationOnce(() => ({
      status: 200,
    }))
    .mockImplementationOnce(() => ({
      status: 200,
      json: () => {
        throw new Error("Exception");
      },
    }));

  await act(async () => {
    return await render(
      <Provider store={store}>
        <HelmetProvider>
          <RouterProvider router={router} />
        </HelmetProvider>
      </Provider>
    );
  });

  expect(error).toHaveBeenCalledTimes(1);
});

test("Edit handles save errors", async () => {
  const error = jest.spyOn(console, "error");
  const post = mockPost("Test Post", "Test content.");

  const store = createStore();
  store.dispatch({
    type: "SET_SESSION",
    session: Object.assign(
      { access: "test_access", refresh: "test_refresh" },
      { username: post.author.username }
    ),
  });

  const router = createMemoryRouter(routes, {
    initialEntries: ["/posts/1/edit"],
  });

  fetch
    .mockImplementationOnce(() => ({
      status: 200,
      json: () => mockPost("Test Post", "Test content."),
    }))
    .mockImplementationOnce(() => ({ status: 500 }));

  const { container } = await act(async () => {
    return await render(
      <Provider store={store}>
        <HelmetProvider>
          <RouterProvider router={router} />
        </HelmetProvider>
      </Provider>
    );
  });

  // Update the post
  const button = await screen.getByTestId("save-button"); // How does this fail?
  await act(async () => {
    await fireEvent.click(button);
  });

  expect(error).toHaveBeenCalledTimes(1);
});

test("Edit can be changed", async () => {
  const post = mockPost("Test Post", "");

  fetch.mockImplementationOnce(() => ({
    status: 200,
    json: () => Promise.resolve(post),
  }));

  const store = createStore();
  store.dispatch({
    type: "SET_SESSION",
    session: Object.assign(
      { access: "test_access", refresh: "test_refresh" },
      { username: post.author.username }
    ),
  });

  const router = createMemoryRouter(routes, {
    initialEntries: ["/posts/1/edit"],
  });

  const { container } = await act(async () => {
    return await render(
      <Provider store={store}>
        <HelmetProvider>
          <RouterProvider router={router} />
        </HelmetProvider>
      </Provider>
    );
  });

  {
    const article = container.querySelector("article");
    expect(article.textContent).toBe("");
  }

  const createPasteEvent = (html) => {
    const text = html.replace("<[^>]*>", "");
    return {
      clipboardData: {
        types: ["text/plain", "text/html"],
        getData: (type) => (type === "text/plain" ? text : html),
      },
    };
  };

  const editor = container.querySelector(".public-DraftEditor-content");
  const eventProperties = createPasteEvent("Test content.");
  const pasteEvent = createEvent.paste(editor, eventProperties);

  await act(async () => {
    await fireEvent(editor, pasteEvent);
  });

  {
    const article = container.querySelector("article");
    expect(article.textContent).toBe("Test content.");
  }

  // Update the post
  fetch.mockImplementation(() => ({ status: 200 }));
  const button = screen.getByTestId("save-button");
  await act(async () => {
    await fireEvent.click(button);
  });

  expect(router.state.location.pathname).toEqual("/posts/1");
});

test("Edit redirects on mismatched user", async () => {
  const post = mockPost("Test Post", "Test content.");

  const fetchPost = () => ({
    status: 200,
    json: () => Promise.resolve(post),
  });

  fetch.mockImplementationOnce(fetchPost).mockImplementationOnce(fetchPost);

  const store = createStore();
  store.dispatch({
    type: "SET_SESSION",
    session: {
      access: "test_access",
      refresh: "test_refresh",
      username: "wrong_username",
    },
  });

  const router = createMemoryRouter(routes, {
    initialEntries: ["/posts/1/edit"],
  });

  await act(async () => {
    await render(
      <Provider store={store}>
        <HelmetProvider>
          <RouterProvider router={router} />
        </HelmetProvider>
      </Provider>
    );
  });

  expect(router.state.location.pathname).toEqual("/posts/1");
});
