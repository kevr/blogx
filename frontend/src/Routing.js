import { createBrowserRouter } from "react-router-dom";
import { Home, Login } from "./pages";
import Layout from "./Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: "/login/",
    element: (
      <Layout>
        <Login />
      </Layout>
    ),
  },
]);

export default router;
