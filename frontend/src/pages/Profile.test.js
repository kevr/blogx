import { act, render, screen, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "../store";
import { mockUser } from "../Testing";
import Profile from "./Profile";

global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

test("Profile renders", async () => {
  const user = mockUser("john");

  fetch.mockImplementationOnce(() => ({
    status: 200,
    json: () => user,
  }));

  const store = createStore();
  await act(async () => {
    await render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );
  });

  const images = screen.getAllByTestId("social-image");
  expect(images.length).toBe(3);

  const links = screen.getAllByTestId("social-link");
  expect(links.length).toBe(3);

  links.forEach((link, idx) => {
    expect(link).toHaveTextContent(user.profile.socials[idx].url);
  });
});

test("Profile renders APIError", async () => {
  const user = mockUser("john");

  fetch.mockImplementationOnce(() => ({
    status: 500,
    json: () => {
      throw new Error("Exception");
    },
  }));

  const store = createStore();
  await act(async () => {
    await render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );
  });
});
