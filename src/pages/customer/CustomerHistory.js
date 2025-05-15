import React, { useState, useEffect, useContext } from "react";
import { Typography, Table, message } from "antd";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
const { Title, Paragraph } = Typography;
const CustomerHistory = () => {
    const { theme } = useContext(ThemeContext);
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                message.error("Vui lòng đăng nhập để xem lịch sử mua hàng!");
                navigate("/customer/login");
                return;
            }

            NProgress.start();
            try {
                const response = await axios.get("/api/orders/my-orders", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                let orderData = response.data.data || [];
                // Thêm trường shortOrderId vào mỗi đơn hàng
                orderData = orderData.map(order => ({
                    ...order,
                    shortOrderId: order._id ? order._id.slice(0, 10) : "",
                }));
                setOrders(orderData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
            } catch (error) {
                console.error("Error fetching orders:", error);
                message.error("Không thể tải lịch sử mua hàng!");
            } finally {
                NProgress.done();
            }
        };
        fetchOrders();
    }, [navigate]);

    const columns = [
        {
            title: "Mã đơn hàng",
            dataIndex: "shortOrderId",
            key: "shortOrderId",
        },
        {
            title: "Thời gian đặt hàng",
            dataIndex: "timestamp",
            key: "timestamp",
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: "Sản phẩm",
            dataIndex: "items",
            key: "items",
            render: (items) => (
                <ul>
                    {items.map((item, index) => (
                        <li key={index}>
                            {item.name} (x{item.quantity})
                        </li>
                    ))}
                </ul>
            ),
        },
        {
            title: "Tổng tiền",
            dataIndex: "total",
            key: "total",
            render: (text) => `${text} VND`,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Phương thức thanh toán",
            dataIndex: "paymentMethod",
            key: "paymentMethod",
        },
    ];

    return (
        <div style={{ padding: "80px 50px", background: "var(--background-color)", minHeight: "100vh" }}>
            <Title level={2} style={{ color: "var(--text-color)" }}>
                Lịch sử mua hàng 📜
            </Title>
            <Paragraph style={{ color: "var(--text-color)" }}>
                Xem lại các đơn hàng bạn đã đặt!
            </Paragraph>
            {orders.length === 0 ? (
                <Paragraph style={{ color: "var(--text-color)" }}>
                    Bạn chưa có đơn hàng nào!
                </Paragraph>
            ) : (
                <Table
                    dataSource={orders}
                    columns={columns}
                    rowKey="_id"
                    style={{ background: "var(--table-bg)" }}
                    pagination={false}
                />
            )}
        </div>
    );
};

export default CustomerHistory;