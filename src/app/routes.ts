// import { createBrowserRouter } from "react-router";
import { createHashRouter } from "react-router-dom";
import { InvitationPage } from "./components/InvitationPage";
import { AdminPanel } from "./components/AdminPanel";

// export const router = createBrowserRouter([
export const router = createHashRouter([
  {
    path: "/",
    Component: InvitationPage,
  },
  {
    path: "/admin",
    Component: AdminPanel,
  },
]);