import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from "@/routes";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/layouts/Header";
import AppContent from "@/layouts/AppContent";
import Footer from "@/layouts/Footer";
import "./App.css";

function App() {
    const router = createBrowserRouter(routes);

    return (
        <div className="app">
            <AuthProvider>
                <Header />
                <AppContent>
                    <RouterProvider router={router} />
                </AppContent>
                <Footer />
            </AuthProvider>
        </div>
    );
}

export default App;
