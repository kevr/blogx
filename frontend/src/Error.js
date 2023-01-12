import config from "./config.json";

export const APIError = () => (
  <div data-testid="error">
    <div>
      <i className="red-text lighten-1 material-icons large">close</i>
    </div>
    <div>
      <div>{"Error: Unable to load data"}</div>
      <div className="text-small">
        Contact webmaster{" "}
        <a href={`mailto:${config.admin.email}`}>{config.admin.email}</a>
      </div>
    </div>
  </div>
);
