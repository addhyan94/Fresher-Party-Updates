import { createBrowserRouter } from "react-router";
import { InvitationPage } from "./components/InvitationPage";
import { AdminPanel } from "./components/AdminPanel";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: InvitationPage,
  },
  {
    path: "/admin",
    Component: AdminPanel,
  },
]);