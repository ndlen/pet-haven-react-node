import React, { useState, useEffect, useContext } from "react";
import { Typography, Card, Button, Pagination, message } from "antd";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
const { Title, Paragraph } = Typography;
import moment from "moment";

const CustomerServices = () => {
    const { theme } = useContext(ThemeContext);
    const [services, setServices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(12);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServices = async () => {
            NProgress.start();
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`/api/services?page=${currentPage}&limit=${pageSize}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setServices(response.data.data || []);
                setTotal(response.data.total || 0);
            } catch (error) {
                console.error("Lỗi khi tải dịch vụ:", error);
                message.error("Không thể tải danh sách dịch vụ. Vui lòng thử lại sau!");
            } finally {
                NProgress.done();
            }
        };
        fetchServices();
    }, [currentPage]);

    const addToCart = async (service) => {
        const token = localStorage.getItem("token");
        if (!token) {
            message.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
            navigate("/customer/login");
            return;
        }

        const userData = JSON.parse(localStorage.getItem("user"));
        if (!userData || !userData._id) {
            message.error("Vui lòng cập nhật thông tin cá nhân trước khi thêm vào giỏ hàng!");
            navigate("/customer/profile");
            return;
        }

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const item = {
            id: service._id.toString(),
            name: service.nameService,
            price: service.price || 0,
            picture: service.picture || "https://via.placeholder.com/200",
            quantity: 1,
            type: "service",
            date: moment().format("YYYY-MM-DD"),
            userId: userData._id.toString(),
            userFullname: userData.fullname,
            userPhone: userData.phone,
            timestamp: new Date().toISOString(),
        };

        const existingItemIndex = cart.findIndex(
            (cartItem) => cartItem.id === service._id && cartItem.userId === userData._id
        );
        if (existingItemIndex >= 0) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push(item);
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        message.success(`${service.nameService} đã được thêm vào giỏ hàng!`);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div style={{ padding: "80px 50px", background: "var(--background-color)", minHeight: "100vh" }}>
            <Title level={2} style={{ color: "var(--text-color)" }}>
                Dịch vụ thú cưng 🐶🐱
            </Title>
            <Paragraph style={{ color: "var(--text-color)" }}>
                Chúng tôi cung cấp các dịch vụ tốt nhất cho thú cưng của bạn!
            </Paragraph>
            {services.length === 0 ? (
                <Paragraph style={{ color: "var(--text-color)" }}>
                    Hiện không có dịch vụ nào để hiển thị.
                </Paragraph>
            ) : (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", padding: "20px" }}>
                        {services.map((service) => (
                            <Card
                                key={service._id}
                                hoverable
                                cover={
                                    <img
                                        alt={service.nameService}
                                        src={service.picture || "https://via.placeholder.com/200"}
                                        style={{ height: 200, objectFit: "cover" }}
                                    />
                                }
                                style={{
                                    background: "var(--table-bg)",
                                    display: "flex",
                                    flexDirection: "column",
                                    minHeight: "400px",
                                }}
                            >
                                <Card.Meta
                                    title={<span style={{ color: "var(--text-color)" }}>{service.nameService}</span>}
                                    description={
                                        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                            <Paragraph
                                                style={{
                                                    color: "var(--text-color)",
                                                    marginBottom: "8px",
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    minHeight: "60px",
                                                }}
                                            >
                                                {service.describe || "Mô tả chưa có"}
                                            </Paragraph>
                                            <div>
                                                <Paragraph style={{ color: "#FFD700", marginBottom: "8px" }}>
                                                    {service.price ? service.price.toLocaleString() : "0"} VND
                                                </Paragraph>
                                                <Button
                                                    type="primary"
                                                    onClick={() => addToCart(service)}
                                                    style={{
                                                        width: "100%",
                                                        height: "40px",
                                                        fontSize: "16px",
                                                        padding: "0 16px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        backgroundColor: "#fa8c16",
                                                        borderColor: "#fa8c16",
                                                    }}
                                                >
                                                    Thêm vào giỏ hàng
                                                </Button>
                                            </div>
                                        </div>
                                    }
                                />
                            </Card>
                        ))}
                    </div>
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={total}
                            onChange={handlePageChange}
                            showSizeChanger={false}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default CustomerServices;