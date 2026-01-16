import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Login from "./auth/Login";
import DefaultLayout from "./pages/layouts/DefaultLayout";
import Registration from "./auth/Registration";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import EmailConfirmation from "./auth/EmailConfirmation";
import { useEffect, useState } from "react";
import useFetch from "./hooks/useFetch";
import { useDispatch } from "react-redux";
import { login, logout } from "./features/authSlice";
import ProtectedRoute from "./routers/ProtectedRoute";
import PublicRoutes from "./routers/PublicRoutes";
import Logs from "./pages/Logs";
import Analytics from "./pages/Analytics";
import Parking from "./pages/Parking";
import SimpleLayout from "./pages/layouts/SimpleLayout";
import Settings from "./pages/Settings";
import AddStudent from "./pages/AddStudent";
import AddGuard from "./pages/AddGuard";
import EmailEditor from "./EmailEditor";
import MapEditor from "./MapEditor";
import Profile from "./pages/Profile";

export default function App() {
  const { fetchData } = useFetch();
  const dispatch = useDispatch();
  const [checkSession, setCheckSession] = useState(true);

  useEffect(() => {
    const verifyUserSession = async () => {
      try {
        const data = await fetchData("super-admin/me", {
          method: "GET",
          timeout: 5000,
        });
        console.log(data);

        dispatch(login(data));
      } catch (error) {
        dispatch(logout());

        if (error.code === "ECONNABORTED") {
          console.error("Session check timed out");
        } else if (error.response) {
          console.error(
            "Session check error:",
            error.response.data?.error || "Unauthorized"
          );
        } else {
          console.error("Network or unknown error:", error.message);
        }
      } finally {
        setCheckSession(false);
      }
    };

    verifyUserSession();
  }, []); // IMPORTANT: empty dependency array

  if (checkSession) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-t-blue-500 border-4 border-blue-200 animate-spin"></div>
      </div>
    );
  }

  const router = createBrowserRouter([
    {
      path: "/otp-verification",
      element: <EmailConfirmation />,
    },
    {
      path: "/map-editor",
      element: <MapEditor />,
    },
    {
      path: "/",
      element: <PublicRoutes />,
      children: [
        {
          index: true,
          element: <Navigate to="sign-in" replace />,
        },
        {
          path: "sign-in",
          element: <Login />,
        },
        {
          path: "sign-up",
          element: <Registration />,
        },
        {
          path: "email",
          element: <EmailEditor />,
        },
      ],
    },
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          element: <DefaultLayout />,
          children: [
            {
              path: "dashboard",
              element: <Dashboard />,
              index: true,
            },
            {
              path: "users",
              element: <Users />,
            },
            {
              path: "add-student",
              element: <AddStudent />,
            },
            {
              path: "add-guard",
              element: <AddGuard />,
            },
            {
              path: "activity-logs",
              element: <Logs />,
            },
            {
              path: "analytics",
              element: <Analytics />,
            },
            {
              path: "parking",
              element: <Parking />,
            },
            {
              path: "account-details",
              element: <Profile />,
            },
          ],
        },
        {
          element: <SimpleLayout />,
          children: [
            {
              path: "settings",
              element: <Settings />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
