import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout";
import Home from "../pages/home";
import Dashboard from "../pages/dashboard";
import NewCar from "../pages/dashboard/newCar";
import CarDetail from "../pages/carDetail";
import Login from "../pages/login";
import Register from "../pages/register";
import Private from "./private";
import ForgetPassword from "../pages/forgetPassword";
import ResetPassword from "../pages/resetPassword";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        element: <Home />,
        path: "/",
      },

      {
        path: "/dashboard",
        element: (
          <Private>
            <Dashboard />
          </Private>
        ),
      },
      {
        element: (
          <Private>
            <NewCar />
          </Private>
        ),
        path: "/dashboard/newCar",
      },
      {
        element: <CarDetail />,
        path: "/carDetail/:id",
      },
    ],
  },
  {
    element: <Login />,
    path: "/login",
  },
  {
    element: <Register />,
    path: "/register",
  },
  {
    element: <ForgetPassword />,
    path: "/forgetPassword",
  },
  {
    element: <ResetPassword />,
    path: "/resetPassword",
  },
]);

export default router;
