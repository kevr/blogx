import { createBrowserRouter } from "react-router-dom";
import { Edit, Home, Login, Post, Profile } from "./pages";
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
  {
    path: "/users/:id",
    element: (
      <Layout>
        <Profile />
      </Layout>
    ),
  },
];

const router = createBrowserRouter(routes);

export default router;
