import { apiRequest, apiInterval, intervalImpl } from "./API";

global.fetch = jest.fn();
global.setInterval = jest.fn();

const error = jest.spyOn(console, "error").mockImplementation(() => {});

beforeEach(() => {
  fetch.mockClear();
  setInterval.mockClear();
});

afterEach(() => {
  error.mockClear();
});

afterAll(() => {
  error.mockRestore();
});

test("apiRequest operates without session", async () => {
  const session = null;
  const dispatch = (action) => {};
  const endpoint = "/test/";
  const data = { key: "value" };

  fetch.mockImplementationOnce((_, options) => {
    return Promise.resolve({
      status: 200,
    });
  });

  const response = await apiRequest(session, dispatch, endpoint, "post", data);
});

test("apiRequest takes data", async () => {
  const session = {
    access: "test_access",
    refresh: "test_refresh",
  };
  const dispatch = (action) => {};
  const endpoint = "/test/";
  const data = { key: "value" };

  global.fetch = jest.fn().mockImplementationOnce((_, options) => {
    return Promise.resolve({
      status: 200,
    });
  });

  const response = await apiRequest(session, dispatch, endpoint, "post", data);
});

test("apiRequest fails", async () => {
  const session = {
    access: "test_access",
    refresh: "test_refresh",
  };
  const dispatch = (action) => {};
  const endpoint = "/test/";
  const data = { key: "value" };

  // Failure is tested by returning HTTP 401 in all cases.
  // apiRequest attempts to refresh its session after an
  // initial HTTP 401, so this tests repeated HTTP 401s,
  // so that the refresh request also fails.
  fetch
    .mockImplementationOnce((_, options) => {
      return Promise.resolve({
        status: 401,
      });
    })
    .mockImplementationOnce((_, options) => {
      return Promise.resolve({
        status: 401,
      });
    });

  const response = await apiRequest(session, dispatch, endpoint, "post", data);
});

test("apiInterval throws", async () => {
  jest.spyOn(console, "error");

  const fetch_ = fetch.mockImplementationOnce((_, options) => {
    return Promise.resolve({
      status: 500,
      json: () => {
        throw new Error("Exception");
      },
    });
  });

  const session = {
    access: "test_access",
    refresh: "test_refresh",
  };
  const dispatch = (action) => {};

  await intervalImpl(session, dispatch);
  await expect(fetch_).toHaveBeenCalledTimes(1);
  await expect(error).toHaveBeenCalledTimes(1);
});
