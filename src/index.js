import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "yorha/dist/yorha.min.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
    <App key={"app"}/>,
    document.getElementById("root")
);
registerServiceWorker();
