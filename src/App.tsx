import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import { routes } from "@/routes";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/layouts/Header";
import AppContent from "@/layouts/AppContent";
import Footer from "@/layouts/Footer";
import "./App.css";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: (
                <div className="app">
                    <AuthProvider>
                        <Header />
                        <AppContent>
                            <Outlet />
                        </AppContent>
                        <Footer />
                    </AuthProvider>
                </div>
            ),
            children: routes,
        },
    ]);

    return <RouterProvider router={router} />;
}

export default App;
