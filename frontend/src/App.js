import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { createStore } from "./store";
import Entry from "./Entry";
import "materialize-css/dist/css/materialize.min.css";
import "./App.css";

function App() {
  const store = createStore();

  return (
    <Provider store={store}>
      <HelmetProvider>
        <Entry />
      </HelmetProvider>
    </Provider>
  );
}

export default App;
