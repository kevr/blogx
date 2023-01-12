import { createBrowserRouter } from "react-router-dom";
import { Home, Login, Post } from "./pages";
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
  {
    path: "/posts/:id",
    element: (
      <Layout>
        <Post />
      </Layout>
    ),
  },
]);

export default router;
