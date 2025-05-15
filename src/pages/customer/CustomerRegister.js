import React, { useContext } from "react";
import { Typography, Card, Form, Input, Select, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";
const { Title } = Typography;

const CustomerRegister = () => {
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        const { fullname, email, phone, dob, gender, password, confirmPassword } = values;

        const dobRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        if (!dobRegex.test(dob)) {
            message.error('Ngày sinh phải có định dạng DD/MM/YYYY!');
            return;
        }

        const [day, month, year] = dob.split('/').map(Number);
        const dobDate = new Date(year, month - 1, day);
        if (
            isNaN(dobDate.getTime()) ||
            dobDate.getDate() !== day ||
            dobDate.getMonth() + 1 !== month ||
            dobDate.getFullYear() !== year ||
            year < 1900 ||
            dobDate > new Date()
        ) {
            message.error('Ngày sinh không hợp lệ!');
            return;
        }

        if (password !== confirmPassword) {
            message.error('Mật khẩu xác nhận không khớp!');
            return;
        }

        try {
            const response = await axios.post('/api/auth/register', {
                fullname,
                email,
                phone,
                dob,
                gender,
                password,
            });
            const { user, message: msg } = response.data;
            message.success(`${msg} Vui lòng kiểm tra email để xác thực tài khoản.`);
            form.resetFields();
            navigate('/customer/login');
        } catch (error) {
            console.error('Registration error:', error);
            message.error(error.response?.data?.error || 'Không thể đăng ký tài khoản. Vui lòng thử lại!');
        }
    };

    return (
        <div style={{ padding: '40px 20px', background: 'var(--background-color)', minHeight: '100vh' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <Title level={2} style={{ color: 'var(--text-color)', textAlign: 'center', marginBottom: 24 }}>
                    Đăng ký
                </Title>
                <Card style={{ maxWidth: 900, margin: '0 auto', background: 'var(--modal-bg)' }}>
                    <Form form={form} onFinish={handleSubmit} layout="vertical">
                        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: 300 }}>
                                <Form.Item
                                    name="fullname"
                                    label="Họ và tên"
                                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                                >
                                    <Input placeholder="Nhập họ và tên" />
                                </Form.Item>
                                <Form.Item
                                    name="phone"
                                    label="Số điện thoại"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                        { pattern: /^\+?[1-9]\d{8,14}$/, message: 'Số điện thoại không hợp lệ!' },
                                    ]}
                                >
                                    <Input placeholder="Nhập số điện thoại" />
                                </Form.Item>
                                <Form.Item
                                    name="password"
                                    label="Mật khẩu"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                                    ]}
                                >
                                    <Input.Password placeholder="Nhập mật khẩu" />
                                </Form.Item>
                            </div>
                            <div style={{ flex: 1, minWidth: 300 }}>
                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập email!' },
                                        { type: 'email', message: 'Email không hợp lệ!' },
                                    ]}
                                >
                                    <Input placeholder="Nhập email của bạn" />
                                </Form.Item>
                                <Form.Item
                                    name="dob"
                                    label="Ngày sinh (DD/MM/YYYY)"
                                    rules={[{ required: true, message: 'Vui lòng nhập ngày sinh!' }]}
                                >
                                    <Input placeholder="VD: 15/03/2000" />
                                </Form.Item>
                                <Form.Item
                                    name="gender"
                                    label="Giới tính"
                                    rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                                >
                                    <Select placeholder="Chọn giới tính">
                                        <Select.Option value="male">Nam</Select.Option>
                                        <Select.Option value="female">Nữ</Select.Option>
                                        <Select.Option value="other">Khác</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="confirmPassword"
                                    label="Xác nhận mật khẩu"
                                    rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }]}
                                >
                                    <Input.Password placeholder="Nhập lại mật khẩu" />
                                </Form.Item>
                            </div>
                        </div>
                        <Form.Item style={{ textAlign: 'center' }}>
                            <Button type="primary" htmlType="submit">
                                Đăng ký
                            </Button>
                        </Form.Item>
                        <div style={{ textAlign: 'center' }}>
                            <a onClick={() => navigate('/customer/login')}>Đã có tài khoản? Đăng nhập ngay</a>
                        </div>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default CustomerRegister;