import { createBrowserRouter } from "react-router-dom";
import { Home, Login, Post, Edit } from "./pages";
import Layout from "./Layout";

export const routes = [
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
];

const router = createBrowserRouter(routes);

export default router;
