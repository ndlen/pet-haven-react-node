import React, { useState, useEffect, useContext } from "react";
import { Menu, Switch, message } from "antd";
import { ShoppingCartOutlined, HomeOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const CustomerNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [user, setUser] = useState(null);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setUser(null);
                    localStorage.removeItem("user");
                    return;
                }
                const response = await axios.get("/api/users/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const userData = response.data.data;
                localStorage.setItem("user", JSON.stringify(userData));
                setUser(userData);
                console.log("Fetched User Data:", userData);
            } catch (error) {
                console.error("Error fetching user:", error);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
                if (location.pathname !== "/customer/login" && location.pathname !== "/customer/register") {
                    message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                    navigate("/customer/login");
                }
            }
        };

        fetchUser();

        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            setCartCount(totalItems);
        };
        updateCartCount();
        window.addEventListener("storage", updateCartCount);
        const interval = setInterval(updateCartCount, 1000);
        return () => {
            window.removeEventListener("storage", updateCartCount);
            clearInterval(interval);
        };
    }, [navigate, location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("cart");
        setCartCount(0);
        setUser(null);
        navigate("/customer/login");
        message.success("Đăng xuất thành công!");
    };

    const menuItems = [
        { key: "/customer/home", icon: <HomeOutlined />, label: "Trang chủ" },
        { key: "/customer/services", icon: <ShoppingCartOutlined />, label: "Dịch vụ" },
        { key: "/customer/foods", icon: <ShoppingCartOutlined />, label: "Thức ăn" },
        {
            key: "/customer/cart",
            icon: <ShoppingCartOutlined />,
            label: (
                <span>
                    Giỏ hàng {cartCount > 0 && <span style={{ color: "#FF4D4F" }}>({cartCount})</span>}
                </span>
            ),
        },
        { key: "/customer/contact", icon: <MailOutlined />, label: "Liên hệ" },
    ];

    return (
        <Menu
            theme={theme}
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={[
                ...menuItems.map((item) => ({
                    key: item.key,
                    icon: item.icon,
                    label: item.label,
                    onClick: () => navigate(item.key),
                })),
                {
                    key: "theme",
                    label: (
                        <Switch
                            checked={theme === "light"}
                            onChange={toggleTheme}
                            checkedChildren="Sáng"
                            unCheckedChildren="Tối"
                        />
                    ),
                    style: { marginLeft: "auto" },
                },
                {
                    key: "user",
                    label: user ? user.fullname : "Đăng nhập",
                    icon: <UserOutlined />,
                    children: user
                        ? [
                            { key: "profile", label: "Thông Tin", onClick: () => navigate("/customer/profile") },
                            { key: "history", label: "Lịch sử mua hàng", onClick: () => navigate("/customer/history") },
                            { key: "logout", label: "Đăng Xuất", onClick: handleLogout },
                        ]
                        : [
                            { key: "login", label: "Đăng nhập", onClick: () => navigate("/customer/login") },
                            { key: "register", label: "Đăng ký", onClick: () => navigate("/customer/register") },
                        ],
                },
            ]}
            style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}
        />
    );
};

export default CustomerNavbar;