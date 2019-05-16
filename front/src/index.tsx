// Polyfills
import "unfetch/polyfill";
import "react-app-polyfill/ie11";

import React from "react";
import ReactDOM from "react-dom";
import "template.data.gouv.fr/dist/style/main.css";
import "./index.scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

const rootElement = document.getElementById("root");

if (rootElement && rootElement.hasChildNodes()) {
  ReactDOM.hydrate(<App />, rootElement);
} else {
  ReactDOM.render(<App />, rootElement);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
