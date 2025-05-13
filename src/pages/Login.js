import React, { useContext } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import axios from "axios";

const { Title } = Typography;

const Login = ({ setIsAdmin }) => {
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const response = await axios.post("/api/auth/login", {
                email: values.email,
                password: values.password, // Xóa sha256
            });
            const { token, user } = response.data.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            setIsAdmin(user.role === "admin");
            message.success("Đăng nhập thành công!");
            navigate("/admin/appointments");
        } catch (error) {
            message.error(error.response?.data?.error || "Đăng nhập thất bại!");
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "var(--background-color)" }}>
            <div style={{ width: 400, padding: 24, background: "var(--modal-bg)", borderRadius: 8 }}>
                <Title level={2} style={{ textAlign: "center", color: "var(--text-color)" }}>
                    Đăng nhập Admin
                </Title>
                <Form onFinish={onFinish} layout="vertical">
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: "Vui lòng nhập email!" }]}
                    >
                        <Input placeholder="Nhập email" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;