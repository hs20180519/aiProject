import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
// import { Provider } from "react-redux";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);

const meta = document.createElement("meta");
meta.httpEquiv = "Content-Security-Policy";
meta.content = "upgrade-insecure-requests";
document.getElementsByTagName("head")[0].appendChild(meta);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
