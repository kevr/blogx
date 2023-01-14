import { createBrowserRouter } from "react-router-dom";
import { Home, Login, Post, Edit } from "./pages";
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
  {
    path: "/posts/:id/edit",
    element: <Edit />,
  },
]);

export default router;
