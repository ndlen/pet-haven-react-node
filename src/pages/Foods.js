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

const Foods = () => {
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
                const fetchFoods = async () => {
                    try {
                        const res = await axios.get("/api/products");
                        setData(res.data.data || []);
                        NProgress.done();
                    } catch (error) {
                        message.error("Không thể tải dữ liệu thức ăn. Vui lòng thử lại sau!");
                        NProgress.done();
                    }
                };
                fetchFoods();
            } catch (error) {
                message.error("Bạn không có quyền truy cập trang này!");
                navigate("/login");
                NProgress.done();
            }
        };

        verifyAdmin();
    }, [navigate]);

    const columns = [
        { title: "Tên", dataIndex: "name", key: "name" },
        { title: "Danh mục", dataIndex: "category", key: "category" },
        { title: "Giá", dataIndex: "price", key: "price", render: (text) => `${text.toLocaleString()} VND` },
        { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
        { title: "Trạng thái", dataIndex: "status", key: "status" },
    ];

    const formFields = [
        { name: "name", label: "Tên", type: "text" },
        { name: "category", label: "Danh mục", type: "text" },
        { name: "price", label: "Giá", type: "text" },
        { name: "quantity", label: "Số lượng", type: "text" },
        { name: "picture", label: "Hình ảnh (URL)", type: "text" },
        {
            name: "status",
            label: "Trạng thái",
            type: "select",
            options: [
                { value: "Có sẵn", label: "Có sẵn" },
                { value: "Hết hàng", label: "Hết hàng" },
            ],
        },
    ];

    const handleEdit = (record) => {
        setEditingRecord(record);
        setModalOpen(true);
    };

    const handleDelete = async (record) => {
        try {
            await axios.delete(`/api/products/${record._id}`);
            setData(data.filter((item) => item._id !== record._id));
        } catch (error) {
            message.error("Không thể xóa sản phẩm!");
        }
    };

    const handleSubmit = async (values) => {
        try {
            values.price = parseInt(values.price);
            values.quantity = parseInt(values.quantity);
            if (editingRecord) {
                await axios.put(`/api/products/${editingRecord._id}`, values);
                setData(
                    data.map((item) =>
                        item._id === editingRecord._id ? { ...item, ...values } : item
                    )
                );
                message.success("Cập nhật sản phẩm thành công!");
            } else {
                const response = await axios.post("/api/products", values);
                setData([...data, response.data.data]);
                message.success("Thêm sản phẩm thành công!");
            }
            setModalOpen(false);
            setEditingRecord(null);
        } catch (error) {
            message.error("Không thể lưu sản phẩm!");
        }
    };

    return (
        <div style={{ background: "var(--background-color)" }}>
            <Title level={2} style={{ color: "var(--text-color)" }}>
                Quản lý thức ăn
            </Title>
            <Button
                type="primary"
                onClick={() => {
                    setEditingRecord(null);
                    setModalOpen(true);
                }}
                style={{ marginBottom: 16 }}
            >
                Thêm thức ăn
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

export default Foods;