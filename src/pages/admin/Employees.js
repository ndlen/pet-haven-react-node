import React, { useState, useEffect, useContext } from "react";
import { Button, Typography, message } from "antd";
import CrudTable from "../../components/CrudTable";
import CrudForm from "../../components/CrudForm";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const Employees = () => {
    const { theme } = useContext(ThemeContext);
    const [data, setData] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAdmin = async () => {
            try {
                const response = await axios.get("/api/users/me");
                if (response.data.data.role !== "admin") {
                    message.error("Bạn không có quyền truy cập trang này!");
                    navigate("/login");
                    return;
                }

                NProgress.start();
                const fetchEmployees = async () => {
                    try {
                        const res = await axios.get("/api/users");
                        const employees = res.data.data.filter(user => user.role === "staff") || [];
                        setData(employees);
                        NProgress.done();
                    } catch (error) {
                        message.error("Không thể tải dữ liệu nhân viên. Vui lòng thử lại sau!");
                        NProgress.done();
                    }
                };
                fetchEmployees();
            } catch (error) {
                message.error("Bạn không có quyền truy cập trang này!");
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
    ];

    const formFields = [
        { name: "fullname", label: "Tên", type: "text" },
        { name: "email", label: "Email", type: "text" },
        { name: "phone", label: "Số điện thoại", type: "text" },
        { name: "password", label: "Mật khẩu", type: "text" },
    ];

    const handleEdit = (record) => {
        setEditingRecord(record);
        setModalOpen(true);
    };

    const handleDelete = async (record) => {
        try {
            await axios.delete(`/api/users/${record._id}`);
            setData(data.filter((item) => item._id !== record._id));
        } catch (error) {
            message.error("Không thể xóa nhân viên!");
        }
    };

    const handleSubmit = async (values) => {
        try {
            if (editingRecord) {
                await axios.put(`/api/users/${editingRecord._id}`, { ...values, role: "staff" });
                setData(
                    data.map((item) =>
                        item._id === editingRecord._id ? { ...item, ...values } : item
                    )
                );
                message.success("Cập nhật nhân viên thành công!");
            } else {
                const response = await axios.post("/api/auth/register", { ...values, role: "staff" });
                setData([...data, response.data.data.user]);
                message.success("Thêm nhân viên thành công!");
            }
            setModalOpen(false);
            setEditingRecord(null);
        } catch (error) {
            message.error("Không thể lưu nhân viên!");
        }
    };

    return (
        <div style={{ background: "var(--background-color)" }}>
            <Title level={2} style={{ color: "var(--text-color)" }}>
                Quản lý nhân viên
            </Title>
            {/* <Button
                type="primary"
                onClick={() => {
                    setEditingRecord(null);
                    setModalOpen(true);
                }}
                style={{ marginBottom: 16 }}
            >
                Thêm nhân viên
            </Button> */}
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

export default Employees;