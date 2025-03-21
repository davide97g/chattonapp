import { Loader } from "@/components/custom/Loader";
import { lazy } from "react";
import { createBrowserRouter } from "react-router";

const SystemStats = lazy(() => import("../pages/SystemStats"));
const GroupChat = lazy(() => import("../pages/GroupChat"));
const NotFound = lazy(() => import("../pages/NotFound"));

export const router = createBrowserRouter([
  {
    path: "/",
    Component: GroupChat,
    loader: Loader,
  },
  {
    path: "/stats",
    Component: SystemStats,
    loader: Loader,
  },
  {
    path: "/*",
    Component: NotFound,
    loader: Loader,
  },
]);
