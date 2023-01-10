import { apiRequest } from "./API";

global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

test("apiRequest operates without session", async () => {
  const session = null;
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
  global.fetch = jest.fn((_, options) => {
    return Promise.resolve({
      status: 401,
    });
  });

  const response = await apiRequest(session, dispatch, endpoint, "post", data);
});
