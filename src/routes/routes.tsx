import Feed from "@pages/feed";
import Login from "@pages/login";
import Welcome from "@pages/welcome";
import ProtectedRoute from "@/components/ProtectedRoute";
import Discover from "@/pages/discover/Discover";

export const routes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/welcome",
    element: (
      <ProtectedRoute>
        <Welcome />
      </ProtectedRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Feed />
      </ProtectedRoute>
    ),
  },
  {
    path: "/feed",
    element: (
      <ProtectedRoute>
        <Feed />
      </ProtectedRoute>
    ),
  },
  {
    path: "/discover",
    element: (
      <ProtectedRoute>
        <Discover />
      </ProtectedRoute>
    ),
  },
];
