import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import "./index.css";

import ErrorPage from "./pages/error-page.jsx";
import Layout from "./components/layout.jsx";
import Main from "./pages/main.jsx";
import Login from "./pages/login/index.jsx";
import Todo from "./pages/todo/index.jsx";
import Register from "./pages/register/index.jsx";
import EditTodo from "./pages/edit-todo/index.jsx";
import CreateTodo from "./pages/create-todo/index.jsx";
import Account from "./pages/account/index.jsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Main />,
      },
      {
        path: "/todos/:id",
        element: <Todo />,
      },
      {
        path: "/todos/:id/edit",
        element: <EditTodo />,
      },
      {
        path: "/create-todo",
        element: <CreateTodo />,
      },
      {
        path: "/account",
        element: <Account />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/Register",
    element: <Register />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
