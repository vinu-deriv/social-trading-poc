import Feed from "@pages/feed";
import Login from "@pages/login";
import ProtectedRoute from "@/components/ProtectedRoute";

export const routes = [
    {
        path: "/login",
        element: <Login />,
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
];
