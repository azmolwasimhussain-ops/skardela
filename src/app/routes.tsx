import { Outlet } from "react-router";

export const routes = [
  {
    path: "/",
    element: <Outlet />,
    errorElement: <div>No index route found</div>,
    children: [
      {
        index: true,
        element: <div>Hello from Skardela!</div>,
      },
      {
        path: "1",
        element: <div>Hello from 1!</div>,
      },
    ],
  },
  {
    path: "/2",
    element: <div>Hello from 2!</div>,
    errorElement: <div>page 2 found</div>,
  },
  {
    path: "*",
    element: <div>Global Page not found</div>,
  }
];
