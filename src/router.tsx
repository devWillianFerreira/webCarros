import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import NewCar from "./pages/dashboard/newCar";
import CarDetail from "./pages/carDetail";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        element: <Home />,
        path: "/",
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
        element: <Dashboard />,
        path: "/dashboard",
      },
      {
        element: <NewCar />,
        path: "/dashboard/newCar",
      },
      {
        element: <CarDetail />,
        path: "/carDetail",
      },
    ],
  },
]);

export default router;
