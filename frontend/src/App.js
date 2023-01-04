import { Provider } from "react-redux";
import { store } from "./store";
import Entry from "./Entry";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <Entry />
    </Provider>
  );
}

export default App;
