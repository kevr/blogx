import { act, render, screen, getByText } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { createStore } from "../store";
import Home from "./Home";

global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

let id = 0;
const mockPost = (title, content) => {
  id += 1;
  return {
    id: id,
    url: `http://testserver/posts/${id}/`,
    author: {
      id: 999,
      url: "http://testserver/users/999/",
      name: "John Doe",
      username: "john",
    },
    title: title,
    content: content,
    created: "2023-1-12T00:00:00Z",
    edited: null,
  };
};

test("renders posts collected from API", async () => {
  const debug = jest.spyOn(console, "debug");

  const mockPosts = [
    mockPost("Post 1", 'Some "Post 1" content.'),
    mockPost("Post 2", 'Some "Post 2" content.'),
  ];

  global.fetch = jest.fn((_, options) => {
    return {
      status: 200,
      json: () => {
        return mockPosts;
      },
    };
  });

  const store = createStore();
  await act(() => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </Provider>
    );
  });

  expect(debug).toHaveBeenCalledWith("Loaded posts");

  const posts = await screen.findAllByTestId("post");
  expect(posts.length).toBe(mockPosts.length);

  const p1 = await getByText(posts[0], "Post 1");
  expect(p1).toBeInTheDocument();

  const p2 = await getByText(posts[1], "Post 2");
  expect(p2).toBeInTheDocument();
});

test("opt-out of rendering posts with API request failure", async () => {
  const error = jest.spyOn(console, "error");

  global.fetch = jest.fn((_, options) => {
    return { status: 500 };
  });

  const store = createStore();
  await act(() => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </Provider>
    );
  });

  expect(error).toHaveBeenCalledWith("Unable to retrieve posts");
  const errorElement = await screen.getByTestId("error");
  expect(errorElement).toBeInTheDocument();
});
