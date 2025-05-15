import React, { useState, useEffect, useContext } from "react";
import { Typography, Card, Button, Pagination, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
const { Title, Paragraph } = Typography;


const CustomerFoods = () => {
    const { theme } = useContext(ThemeContext);
    const [foods, setFoods] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFoods = async () => {
            NProgress.start();
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`/api/products?page=${currentPage}&limit=${pageSize}&category=${selectedCategory === "all" ? "" : selectedCategory}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const foodData = response.data.data || [];
                setFoods(foodData);
                setTotal(response.data.total || 0);
                const uniqueCategories = [...new Set(foodData.map((food) => food.category || "Không xác định"))];
                setCategories(uniqueCategories);
            } catch (error) {
                console.error("Lỗi khi tải thức ăn:", error);
                message.error("Không thể tải danh sách thức ăn. Vui lòng thử lại sau!");
            } finally {
                NProgress.done();
            }
        };
        fetchFoods();
    }, [currentPage, selectedCategory, pageSize]);

    const addToCart = async (food) => {
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
            id: food._id.toString(),
            name: food.name,
            price: food.price,
            picture: food.picture,
            quantity: 1,
            type: "food",
            userId: userData._id.toString(),
            userFullname: userData.fullname,
            userPhone: userData.phone,
            timestamp: new Date().toISOString(),
        };

        const existingItemIndex = cart.findIndex(
            (cartItem) => cartItem.id === food._id && cartItem.userId === userData._id
        );
        if (existingItemIndex >= 0) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push(item);
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        message.success(`${food.name} đã được thêm vào giỏ hàng!`);
    };

    const handlePageChange = (page, newPageSize) => {
        setCurrentPage(page);
        if (newPageSize !== pageSize) {
            setPageSize(newPageSize);
            setCurrentPage(1);
        }
    };

    return (
        <div style={{ padding: "80px 50px", background: "var(--background-color)", minHeight: "100vh" }}>
            <Title level={2} style={{ color: "var(--text-color)" }}>
                Thức ăn cho thú cưng 🍖🥫
            </Title>
            <Paragraph style={{ color: "var(--text-color)" }}>
                Dinh dưỡng tốt nhất cho người bạn nhỏ của bạn!
            </Paragraph>
            <div style={{ marginBottom: "20px" }}>
                <Select
                    style={{ width: 200 }}
                    value={selectedCategory}
                    onChange={(value) => {
                        setSelectedCategory(value);
                        setCurrentPage(1);
                    }}
                >
                    <Select.Option value="all">Tất cả danh mục</Select.Option>
                    {categories.map((category) => (
                        <Select.Option key={category} value={category}>
                            {category}
                        </Select.Option>
                    ))}
                </Select>
            </div>
            {foods.length === 0 ? (
                <Paragraph style={{ color: "var(--text-color)" }}>
                    Hiện không có sản phẩm nào trong danh mục này!
                </Paragraph>
            ) : (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", padding: "20px" }}>
                        {foods.map((food) => (
                            <Card
                                key={food._id}
                                hoverable
                                cover={
                                    <img
                                        alt={food.name}
                                        src={food.picture || "https://via.placeholder.com/200"}
                                        style={{ height: 200, objectFit: "cover" }}
                                    />
                                }
                                style={{ background: "var(--table-bg)" }}
                            >
                                <Card.Meta
                                    title={<span style={{ color: "var(--text-color)" }}>{food.name}</span>}
                                    description={
                                        <div>
                                            <Paragraph style={{ color: "var(--text-color)" }}>
                                                Danh mục: {food.category || "Không xác định"}
                                            </Paragraph>
                                            <Paragraph style={{ color: "#FFD700" }}>
                                                {food.price ? food.price.toLocaleString() : "0"} VND
                                            </Paragraph>
                                            <Button type="primary" onClick={() => addToCart(food)}>
                                                Thêm vào giỏ hàng
                                            </Button>
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
                            showSizeChanger
                            pageSizeOptions={["12", "24", "36"]}
                            showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} sản phẩm`}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default CustomerFoods;