import React, { useState, useEffect, useContext } from "react";
import { Button, Typography, message, Tag } from "antd";
import CrudTable from "../components/CrudTable";
import CrudForm from "../components/CrudForm";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const { Title } = Typography;

const Appointments = () => {
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
                const fetchAppointments = async () => {
                    try {
                        const res = await axios.get("/api/appointments");
                        const appointments = res.data.data || [];
                        appointments.sort((a, b) => {
                            const dateA = a.date || "";
                            const dateB = b.date || "";
                            return dateA.localeCompare(dateB);
                        });
                        setData(appointments);
                        NProgress.done();
                    } catch (error) {
                        message.error("Không thể tải dữ liệu lịch hẹn. Vui lòng thử lại sau!");
                        NProgress.done();
                    }
                };
                fetchAppointments();
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
        { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
        {
            title: "Thời gian",
            dataIndex: "date",
            key: "date",
            render: (text) => text || "Chưa thiết lập",
        },
        { title: "Dịch vụ", dataIndex: "service", key: "service" },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (text) => {
                let color;
                switch (text) {
                    case "Chờ xác nhận":
                        color = "blue";
                        break;
                    case "Đã xác nhận":
                        color = "green";
                        break;
                    case "Hoàn thành":
                        color = "gold";
                        break;
                    case "Đã hủy":
                        color = "red";
                        break;
                    default:
                        color = "default";
                }
                return <Tag color={color}>{text}</Tag>;
            },
        },
    ];

    const formFields = [
        { name: "fullname", label: "Tên", type: "text" },
        { name: "phone", label: "Số điện thoại", type: "text" },
        { name: "date", label: "Thời gian", type: "date" },
        { name: "service", label: "Dịch vụ", type: "text" },
        {
            name: "status",
            label: "Trạng thái",
            type: "select",
            options: [
                { value: "Chờ xác nhận", label: "Chờ xác nhận" },
                { value: "Đã xác nhận", label: "Đã xác nhận" },
                { value: "Hoàn thành", label: "Hoàn thành" },
                { value: "Đã hủy", label: "Đã hủy" },
            ],
        },
    ];

    const handleEdit = (record) => {
        setEditingRecord(record);
        setModalOpen(true);
    };

    const handleDelete = async (record) => {
        try {
            await axios.delete(`/api/appointments/${record._id}`);
            setData(data.filter((item) => item._id !== record._id));
        } catch (error) {
            message.error("Không thể xóa lịch hẹn!");
        }
    };

    const handleSubmit = async (values) => {
        try {
            if (editingRecord) {
                await axios.put(`/api/appointments/${editingRecord._id}`, values);
                setData(
                    data.map((item) =>
                        item._id === editingRecord._id ? { ...item, ...values } : item
                    )
                );
                message.success("Cập nhật lịch hẹn thành công!");
            }
            setModalOpen(false);
            setEditingRecord(null);
        } catch (error) {
            message.error("Không thể lưu lịch hẹn!");
        }
    };

    return (
        <div style={{ background: "var(--background-color)" }}>
            <Title level={2} style={{ color: "var(--text-color)" }}>
                Quản lý lịch hẹn
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

export default Appointments;