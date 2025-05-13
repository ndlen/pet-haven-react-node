import React, { useContext } from "react";
import { Menu, Switch } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { HomeOutlined, UserOutlined, CalendarOutlined, ShoppingCartOutlined, BarChartOutlined } from "@ant-design/icons";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useContext(ThemeContext);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const menuItems = [
        { key: "/admin/appointments", icon: <CalendarOutlined />, label: "Lịch hẹn" },
        { key: "/admin/foods", icon: <ShoppingCartOutlined />, label: "Thức ăn" },
        { key: "/admin/services", icon: <ShoppingCartOutlined />, label: "Dịch vụ" },
        { key: "/admin/users", icon: <UserOutlined />, label: "Người dùng" },
        { key: "/admin/schedule", icon: <CalendarOutlined />, label: "Lịch làm việc" },
        { key: "/admin/employees", icon: <UserOutlined />, label: "Nhân viên" },
        { key: "/admin/statistics", icon: <BarChartOutlined />, label: "Thống kê" },
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
                    key: "logout",
                    label: "Đăng xuất",
                    icon: <UserOutlined />,
                    onClick: handleLogout,
                },
            ]}
            style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}
        />
    );
};

export default Navbar;