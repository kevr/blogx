import { RouterProvider } from "react-router-dom";
import router from "./Routing";

const Entry = () => {
  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
};

export default Entry;
