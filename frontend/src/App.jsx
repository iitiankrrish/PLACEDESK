import "./App.css";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Chat from "./components/Chat.jsx";
import LoginStudent from "./components/LoginStudent.jsx";
import LoginAdmin from "./components/LoginAdmin.jsx";
import RegisterAdmin from "./components/RegisterAdmin.jsx";
import RegisterStudent from "./components/RegisterStudent.jsx";
import Mails from "./components/Mails.jsx";
import ComposeMail from "./components/ComposeMail.jsx";
import LandingPage from "./components/LandingPage.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/register/student",
    element: <RegisterStudent />,
  },
  {
    path: "/register/admin",
    element: <RegisterAdmin />,
  },
  {
    path: "/login/student",
    element: <LoginStudent />,
  },
  {
    path: "/login/admin",
    element: <LoginAdmin />,
  },
  // ADMIN ROUTES
  {
    path: "/admin",
    element: <Navigate to="/admin/mails" />,
  },
  {
    path: "/admin/mails",
    element: <Mails />,
  },
  {
    path: "/admin/mails/composemail",
    element: <ComposeMail />,
  },
  {
    path: "/admin/chat",
    element: <Chat />,
  },
  {
    path: "/student",
    element: <Navigate to="/student/chat" />,
  },
  {
    path: "/student/chat",
    element: <Chat />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;