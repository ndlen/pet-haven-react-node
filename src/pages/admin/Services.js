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

const Services = () => {
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
                const fetchServices = async () => {
                    try {
                        const res = await axios.get("/api/services");
                        setData(res.data.data || []);
                        NProgress.done();
                    } catch (error) {
                        message.error("Không thể tải dữ liệu dịch vụ. Vui lòng thử lại sau!");
                        NProgress.done();
                    }
                };
                fetchServices();
            } catch (error) {
                message.error("Bạn không có quyền truy cập trang này!");
                navigate("/login");
                NProgress.done();
            }
        };

        verifyAdmin();
    }, [navigate]);

    const columns = [
        { title: "Tên dịch vụ", dataIndex: "nameService", key: "nameService" },
        { title: "Mô tả", dataIndex: "describe", key: "describe" },
        { title: "Giá", dataIndex: "price", key: "price", render: (text) => `${text.toLocaleString()} VND` },
    ];

    const formFields = [
        { name: "nameService", label: "Tên dịch vụ", type: "text" },
        { name: "describe", label: "Mô tả", type: "text" },
        { name: "price", label: "Giá", type: "text" },
        { name: "picture", label: "Hình ảnh (URL)", type: "text" },
    ];

    const handleEdit = (record) => {
        setEditingRecord(record);
        setModalOpen(true);
    };

    const handleDelete = async (record) => {
        try {
            await axios.delete(`/api/services/${record._id}`);
            setData(data.filter((item) => item._id !== record._id));
        } catch (error) {
            message.error("Không thể xóa dịch vụ!");
        }
    };

    const handleSubmit = async (values) => {
        try {
            values.price = parseInt(values.price);
            if (editingRecord) {
                await axios.put(`/api/services/${editingRecord._id}`, values);
                setData(
                    data.map((item) =>
                        item._id === editingRecord._id ? { ...item, ...values } : item
                    )
                );
                message.success("Cập nhật dịch vụ thành công!");
            } else {
                const response = await axios.post("/api/services", values);
                setData([...data, response.data.data]);
                message.success("Thêm dịch vụ thành công!");
            }
            setModalOpen(false);
            setEditingRecord(null);
        } catch (error) {
            message.error("Không thể lưu dịch vụ!");
        }
    };

    return (
        <div style={{ background: "var(--background-color)" }}>
            <Title level={2} style={{ color: "var(--text-color)" }}>
                Quản lý dịch vụ
            </Title>
            <Button
                type="primary"
                onClick={() => {
                    setEditingRecord(null);
                    setModalOpen(true);
                }}
                style={{ marginBottom: 16 }}
            >
                Thêm dịch vụ
            </Button>
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

export default Services;