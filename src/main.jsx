import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Footer } from "./components/shared/footer";
import { Header } from "./components/shared/header";
import "./index.css";
import { RecoilRoot } from "recoil";

ReactDOM.createRoot(document.getElementById("root")).render(
  <RecoilRoot>
    <App></App>
  </RecoilRoot>
);
