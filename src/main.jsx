import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import "./index.css";
import { AuthMeProvider } from "./contexts/AuthMeContext";
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <AuthMeProvider>
        <App />
      </AuthMeProvider>
    </PersistGate>
  </Provider>
);
