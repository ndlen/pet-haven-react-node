import React, { useContext, useEffect } from "react";
import { Typography, Card, Form, Input, Select, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";
const { Title } = Typography;
const CustomerProfile = () => {
    const { theme } = useContext(ThemeContext);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                message.error("Vui lòng đăng nhập để xem hồ sơ!");
                navigate("/customer/login");
                return;
            }

            try {
                const response = await axios.get("http://localhost:3000/api/users/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const userData = response.data.data;
                localStorage.setItem("user", JSON.stringify(userData));
                form.setFieldsValue({
                    fullname: userData.fullname || "",
                    email: userData.email || "",
                    phone: userData.phone || "",
                    dob: userData.dob || "",
                    gender: userData.gender || "",
                });
                console.log("Fetched User Data:", userData);
            } catch (error) {
                console.error("Error fetching user data:", error);
                message.error("Không thể tải thông tin người dùng!");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/customer/login");
            }
        };
        fetchUserData();
    }, [form, navigate]);

    const handleSubmit = async (values) => {
        console.log("Submitting values:", values);
        console.log("Request URL:", "http://localhost:3000/api/users/me");

        const { phone, dob, fullname, gender } = values;
        const phoneRegex = /^\+?[1-9]\d{8,14}$/; // Fixed typo from previous version
        if (!phoneRegex.test(phone)) {
            message.error("Số điện thoại không hợp lệ! Vui lòng nhập số hợp lệ (ví dụ: +84912345678)");
            return;
        }

        const dobRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        if (!dobRegex.test(dob)) {
            message.error("Ngày sinh phải có định dạng DD/MM/YYYY!");
            return;
        }

        const [day, month, year] = dob.split("/").map(Number);
        const dobDate = new Date(year, month - 1, day);
        if (
            isNaN(dobDate.getTime()) ||
            dobDate.getDate() !== day ||
            dobDate.getMonth() + 1 !== month ||
            dobDate.getFullYear() !== year ||
            year < 1900 ||
            dobDate > new Date()
        ) {
            message.error("Ngày sinh không hợp lệ!");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                "http://localhost:3000/api/users/me",
                { phone, dob, fullname, gender },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const updatedUserData = response.data.data;
            localStorage.setItem("user", JSON.stringify(updatedUserData));
            message.success("Thông tin đã được cập nhật!");
        } catch (error) {
            console.error("Error updating profile:", error.response?.data || error.message);
            message.error(error.response?.data?.error || "Lỗi khi cập nhật thông tin. Vui lòng thử lại!");
        }
    };

    const handleChangePassword = async (values) => {
        console.log("Changing password with values:", values);
        console.log("Request URL:", "http://localhost:3000/api/users/me");

        const { password, confirmPassword } = values;

        if (password && password.length < 6) {
            message.error("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }

        if (password && password !== confirmPassword) {
            message.error("Mật khẩu xác nhận không khớp!");
            return;
        }

        if (password) {
            try {
                const token = localStorage.getItem("token");
                await axios.put(
                    "http://localhost:3000/api/users/me",
                    { password },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                message.success("Mật khẩu đã được cập nhật!");
                form.setFieldsValue({ password: "", confirmPassword: "" });
            } catch (error) {
                console.error("Error updating password:", error.response?.data || error.message);
                message.error(error.response?.data?.error || "Lỗi khi cập nhật mật khẩu. Vui lòng thử lại!");
            }
        } else {
            message.info("Vui lòng nhập mật khẩu mới để thay đổi!");
        }
    };

    return (
        <div style={{ padding: "40px 20px", background: "var(--background-color)", minHeight: "100vh" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <Title level={2} style={{ color: "var(--text-color)", textAlign: "center", marginBottom: 24 }}>
                    Thông tin cá nhân
                </Title>
                <Card style={{ maxWidth: 900, margin: "0 auto", background: "var(--modal-bg)" }}>
                    <Form form={form} onFinish={handleSubmit} layout="vertical">
                        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                            <div style={{ flex: 1, minWidth: 300 }}>
                                <Form.Item
                                    name="fullname"
                                    label="Họ và tên"
                                    rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
                                >
                                    <Input placeholder="Nhập họ và tên" />
                                </Form.Item>
                                <Form.Item
                                    name="phone"
                                    label="Số điện thoại"
                                    rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                                >
                                    <Input placeholder="Nhập số điện thoại" />
                                </Form.Item>
                                <Form.Item
                                    name="password"
                                    label="Mật khẩu mới"
                                >
                                    <Input.Password placeholder="Nhập mật khẩu mới" />
                                </Form.Item>
                            </div>
                            <div style={{ flex: 1, minWidth: 300 }}>
                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[{ required: true, message: "Vui lòng nhập email!" }]}
                                >
                                    <Input disabled />
                                </Form.Item>
                                <Form.Item
                                    name="dob"
                                    label="Ngày sinh (DD/MM/YYYY)"
                                    rules={[{ required: true, message: "Vui lòng nhập ngày sinh!" }]}
                                >
                                    <Input placeholder="VD: 15/03/2000" />
                                </Form.Item>
                                <Form.Item
                                    name="gender"
                                    label="Giới tính"
                                    rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
                                >
                                    <Select placeholder="Chọn giới tính">
                                        <Select.Option value="male">Nam</Select.Option>
                                        <Select.Option value="female">Nữ</Select.Option>
                                        <Select.Option value="other">Khác</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="confirmPassword"
                                    label="Xác nhận mật khẩu mới"
                                >
                                    <Input.Password placeholder="Xác nhận mật khẩu mới" />
                                </Form.Item>
                            </div>
                        </div>
                        <Form.Item style={{ textAlign: "center" }}>
                            <Button
                                type="default"
                                onClick={() => handleChangePassword(form.getFieldsValue())}
                                style={{ marginRight: 16 }}
                            >
                                Đổi mật khẩu
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Lưu thay đổi
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default CustomerProfile;