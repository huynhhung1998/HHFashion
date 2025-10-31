import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "@heroui/toast";
import { HeroUIProvider } from "@heroui/react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HeroUIProvider>
      <ToastProvider placement="top-center" />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HeroUIProvider>
  </StrictMode>
);
