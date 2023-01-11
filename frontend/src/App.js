import { Provider } from "react-redux";
import { createStore } from "./store";
import Entry from "./Entry";
import "materialize-css/dist/css/materialize.min.css";
import "./App.css";

function App() {
  const store = createStore();

  return (
    <Provider store={store}>
      <Entry />
    </Provider>
  );
}

export default App;
