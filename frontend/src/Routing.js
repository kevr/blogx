import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
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
]);

export default router;
