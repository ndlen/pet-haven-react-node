import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import { Layout, Spin } from "antd";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Appointments from "./pages/Appointments";
import Foods from "./pages/Foods";
import Services from "./pages/Services";
import Users from "./pages/Users";
import Login from "./pages/Login";
import CustomerApp from "./customer/CustomerApp";
import Employees from "./pages/Employees";
import ErrorPage from "./pages/Error";
import axios from "axios";
import "./styles.css";

axios.defaults.baseURL = "http://localhost:3000";

axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const { Content } = Layout;

const App = () => {
    const [isAdmin, setIsAdmin] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setIsAdmin(false);
                    return;
                }
                const response = await axios.get("/api/users/me");
                setIsAdmin(response.data.data.role === "admin");
            } catch (error) {
                console.error("Error checking auth:", error);
                setIsAdmin(false);
            }
        };
        checkAuth();
    }, []);

    if (isAdmin === null) {
        return <Spin size="large" style={{ display: "block", margin: "50px auto" }} />;
    }

    const router = createBrowserRouter([
        {
            path: "/customer/*",
            element: <CustomerApp />,
        },
        {
            path: "/login",
            element: isAdmin ? <Navigate to="/admin/appointments" /> : <Login setIsAdmin={setIsAdmin} />,
        },
        {
            path: "/admin",
            element: isAdmin ? (
                <Layout>
                    <Navbar />
                    <Content style={{ padding: "80px 50px" }}>
                        <Outlet />
                    </Content>
                </Layout>
            ) : (
                <Navigate to="/login" />
            ),
            errorElement: <ErrorPage />,
            children: [
                { path: "", element: <Navigate to="appointments" /> },
                { path: "appointments", element: <Appointments /> },
                { path: "foods", element: <Foods /> },
                { path: "services", element: <Services /> },
                { path: "users", element: <Users /> },
                { path: "employees", element: <Employees /> },
                { path: "*", element: <ErrorPage /> },
            ],
        },
        {
            path: "/",
            element: <Navigate to="/customer" />,
        },
        {
            path: "*",
            element: <ErrorPage />,
            errorElement: <ErrorPage />,
        },
    ]);

    return (
        <ThemeProvider>
            <RouterProvider router={router} />
        </ThemeProvider>
    );
};

export default App;