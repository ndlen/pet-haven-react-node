import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import { Layout, Spin } from "antd";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import axios from "axios";
import "./styles.css";
import Appointments from "./pages/admin/Appointments";
import Foods from "./pages/admin/Foods";
import Services from "./pages/admin/Services";
import Users from "./pages/admin/Users";
import Employees from "./pages/admin/Employees";
import ErrorPage from "./pages/Error";
import Login from "./pages/admin/Login";
import CustomerNavbar from "./pages/customer/CustomerNavbar";
import CustomerHome from "./pages/customer/CustomerHome";
import CustomerServices from "./pages/customer/CustomerServices";
import CustomerFoods from "./pages/customer/CustomerFoods";
import CustomerCart from "./pages/customer/CustomerCart";
import CustomerLogin from "./pages/customer/CustomerLogin";
import CustomerRegister from "./pages/customer/CustomerRegister";
import CustomerProfile from "./pages/customer/CustomerProfile";
import CustomerContact from "./pages/customer/CustomerContact";
import CustomerHistory from "./pages/customer/CustomerHistory";

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
    const [isCustomerLoading, setIsCustomerLoading] = useState(true);

    // Kiểm tra quyền admin
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setIsAdmin(false);
                    setIsCustomerLoading(false);
                    return;
                }
                const response = await axios.get("/api/users/me");
                setIsAdmin(response.data.data.role === "admin");
                setIsCustomerLoading(false);
            } catch (error) {
                console.error("Error checking auth:", error);
                setIsAdmin(false);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setIsCustomerLoading(false);
            }
        };
        checkAuth();
    }, []);

    if (isAdmin === null || isCustomerLoading) {
        return <Spin size="large" style={{ display: "block", margin: "50px auto" }} />;
    }

    const router = createBrowserRouter([
        {
            path: "/customer",
            element: (
                <div style={{ minHeight: "100vh", background: "var(--background-color)" }}>
                    <CustomerNavbar />
                    <Outlet />
                </div>
            ),
            children: [
                { path: "", element: <Navigate to="home" /> },
                { path: "home", element: <CustomerHome /> },
                { path: "services", element: <CustomerServices /> },
                { path: "foods", element: <CustomerFoods /> },
                { path: "cart", element: <CustomerCart /> },
                { path: "login", element: <CustomerLogin /> },
                { path: "register", element: <CustomerRegister /> },
                { path: "profile", element: <CustomerProfile /> },
                { path: "contact", element: <CustomerContact /> },
                { path: "history", element: <CustomerHistory /> },
                { path: "*", element: <CustomerHome /> },
            ],
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