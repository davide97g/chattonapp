import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { AuthProvider } from "./context/Auth/AuthProvider.tsx";
import { SocketProvider } from "./context/Socket/SocketProvider.tsx";
import { ThemeProvider } from "./context/ThemeProvider.tsx";
import "./index.css";
import { router } from "./router/index.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="chat-theme">
      <AuthProvider>
        <SocketProvider>
          <RouterProvider router={router} />
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
