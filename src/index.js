import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // 匯入全域樣式
import App from "./App"; // 匯入 App 組件（或你自己的主組件）

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
