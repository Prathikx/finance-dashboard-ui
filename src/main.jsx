import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

window.onerror = (msg, url, lineNo, columnNo, error) => {
  document.body.innerHTML = `
    <div style="padding: 40px; font-family: system-ui; text-align: center;">
      <h1 style="color: #ef4444;">Application Crash Detected</h1>
      <p style="color: #64748b; margin-bottom: 24px;">Something went wrong while rendering the dashboard.</p>
      <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; text-align: left; font-family: monospace; font-size: 14px; overflow: auto; max-width: 600px; margin: 0 auto;">
        ${msg}
      </div>
      <button onclick="window.location.reload()" style="margin-top: 24px; padding: 12px 24px; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 700;">
        Reload Page
      </button>
    </div>
  `;
  return false;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

