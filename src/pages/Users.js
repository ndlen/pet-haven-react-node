import React, { useState, useEffect, useContext } from "react";
import { Button, Typography, message } from "antd";
import CrudTable from "../components/CrudTable";
import CrudForm from "../components/CrudForm";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const Users = () => {
    const { theme } = useContext(ThemeContext);
    const [data, setData] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAdmin = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/users/me", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                if (response.data.data.role !== "admin") {
                    message.error("Bạn không có quyền truy cập!");
                    navigate("/login");
                    return;
                }

                NProgress.start();
                const res = await axios.get("http://localhost:3000/api/users", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                setData(res.data.data || []);
                NProgress.done();
            } catch (error) {
                console.error('Error verifying admin or fetching users:', error.message);
                message.error("Không thể tải dữ liệu!");
                navigate("/login");
                NProgress.done();
            }
        };

        verifyAdmin();
    }, [navigate]);

    const columns = [
        { title: "Tên", dataIndex: "fullname", key: "fullname" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
        { title: "Vai trò", dataIndex: "role", key: "role" },
    ];

    const formFields = [
        { name: "fullname", label: "Tên", type: "text", rules: [{ required: true, message: "Vui lòng nhập tên!" }] },
        { name: "phone", label: "Số điện thoại", type: "text", rules: [{ required: true, message: "Vui lòng nhập số điện thoại!" }, { pattern: /^\+?[1-9]\d{8,14}$/, message: "Số điện thoại không hợp lệ!" }] },
        { name: "password", label: "Mật khẩu mới", type: "password", rules: [{ min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" }] },
        {
            name: "role",
            label: "Vai trò",
            type: "select",
            options: [
                { value: "user", label: "Người dùng" },
                { value: "staff", label: "Nhân viên" },
                { value: "admin", label: "Quản trị viên" },
            ],
            rules: [{ required: true, message: "Vui lòng chọn vai trò!" }]
        },
    ];

    const handleEdit = (record) => {
        setEditingRecord({ ...record, password: '' }); // Clear password field
        setModalOpen(true);
    };

    const handleDelete = async (record) => {
        try {
            await axios.delete(`http://localhost:3000/api/users/${record._id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setData(data.filter((item) => item._id !== record._id));
            message.success("Xóa người dùng thành công!");
        } catch (error) {
            console.error('Error deleting user:', error.message);
            message.error("Không thể xóa người dùng!");
        }
    };

    const handleSubmit = async (values) => {
        try {
            // Remove empty password field
            const payload = { ...values };
            if (!payload.password) {
                delete payload.password;
            }
            console.log('Submitting payload:', payload);

            await axios.put(`http://localhost:3000/api/users/${editingRecord._id}`, payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setData(
                data.map((item) =>
                    item._id === editingRecord._id ? { ...item, ...payload } : item
                )
            );
            message.success("Cập nhật người dùng thành công!");
            setModalOpen(false);
            setEditingRecord(null);
        } catch (error) {
            console.error('Error updating user:', error.response?.data || error.message);
            message.error(error.response?.data?.error || "Không thể lưu người dùng!");
        }
    };

    return (
        <div style={{ background: "var(--background-color)", padding: "20px" }}>
            <Title level={2} style={{ color: "var(--text-color)" }}>
                Quản lý người dùng
            </Title>
            <CrudTable
                data={data}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            <CrudForm
                visible={modalOpen}
                onCancel={() => {
                    setModalOpen(false);
                    setEditingRecord(null);
                }}
                onSubmit={handleSubmit}
                initialValues={editingRecord}
                formType={editingRecord ? "edit" : "add"}
                fields={formFields}
            />
        </div>
    );
};

export default Users;