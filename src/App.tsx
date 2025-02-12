import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from "@/routes";
import { AuthProvider } from "@/context/AuthContext";
import "./App.css";

function App() {
    const router = createBrowserRouter(routes);

    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
}

export default App;
