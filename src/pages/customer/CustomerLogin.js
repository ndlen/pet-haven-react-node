import React, { useContext } from "react";
import { Typography, Card, Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";
const { Title } = Typography;
const CustomerLogin = () => {
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        try {
            const response = await axios.post("/api/auth/login", {
                email: values.email,
                password: values.password,
            });
            const { token, user } = response.data.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            console.log("Stored User Data:", user);
            message.success("Đăng nhập thành công!");
            navigate("/customer/home");
        } catch (error) {
            console.error("Login error:", error);
            message.error(error.response?.data?.error || "Email hoặc mật khẩu không đúng!");
        }
    };

    return (
        <div style={{ padding: "40px 20px", background: "var(--background-color)", minHeight: "100vh" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <Title level={2} style={{ color: "var(--text-color)", textAlign: "center", marginBottom: 24 }}>
                    Đăng nhập
                </Title>
                <Card style={{ maxWidth: 600, margin: "0 auto", background: "var(--modal-bg)" }}>
                    <Form onFinish={handleSubmit} layout="vertical">
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
                        >
                            <Input placeholder="Nhập email của bạn" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu" />
                        </Form.Item>
                        <Form.Item style={{ textAlign: "center" }}>
                            <Button type="primary" htmlType="submit" block>
                                Đăng nhập
                            </Button>
                        </Form.Item>
                        <div style={{ textAlign: "center" }}>
                            <a href="#" onClick={() => message.info("Tính năng quên mật khẩu chưa được triển khai.")}>
                                Quên mật khẩu?
                            </a>
                            <br />
                            <a onClick={() => navigate("/customer/register")}>Đăng ký tài khoản</a>
                        </div>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default CustomerLogin;