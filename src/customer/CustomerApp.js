import React, { useState, useEffect, useContext } from "react";
import { Routes, Route, useNavigate, useLocation, Link } from "react-router-dom";
import { Menu, Switch, Button, Card, Typography, message, InputNumber, Image, Spin, Form, Input, Select, Table, Pagination, DatePicker } from "antd";
import { ShoppingCartOutlined, DeleteOutlined, HomeOutlined, MailOutlined, UserOutlined, PhoneOutlined, LockOutlined, CalendarOutlined, ManOutlined } from "@ant-design/icons";
import { ThemeContext } from "../context/ThemeContext";
import moment from "moment";
import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "../styles.css";
import background from '../assets/images/background.jpg';
import haven from '../assets/images/haven.jpg';

const { Title, Paragraph } = Typography;

const CustomerNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [user, setUser] = useState(null);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setUser(null);
                    localStorage.removeItem("user");
                    return;
                }
                const response = await axios.get("/api/users/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const userData = response.data.data;
                localStorage.setItem("user", JSON.stringify(userData));
                setUser(userData);
                console.log("Fetched User Data:", userData);
            } catch (error) {
                console.error("Error fetching user:", error);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
                if (location.pathname !== "/customer/login" && location.pathname !== "/customer/register") {
                    message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                    navigate("/customer/login");
                }
            }
        };

        fetchUser();

        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            setCartCount(totalItems);
        };
        updateCartCount();
        window.addEventListener("storage", updateCartCount);
        const interval = setInterval(updateCartCount, 1000);
        return () => {
            window.removeEventListener("storage", updateCartCount);
            clearInterval(interval);
        };
    }, [navigate, location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("cart");
        setCartCount(0);
        setUser(null);
        navigate("/customer/login");
        message.success("Đăng xuất thành công!");
    };

    const menuItems = [
        { key: "/customer/home", icon: <HomeOutlined />, label: "Trang chủ" },
        { key: "/customer/services", icon: <ShoppingCartOutlined />, label: "Dịch vụ" },
        { key: "/customer/foods", icon: <ShoppingCartOutlined />, label: "Thức ăn" },
        {
            key: "/customer/cart",
            icon: <ShoppingCartOutlined />,
            label: (
                <span>
                    Giỏ hàng {cartCount > 0 && <span style={{ color: "#FF4D4F" }}>({cartCount})</span>}
                </span>
            ),
        },
        { key: "/customer/contact", icon: <MailOutlined />, label: "Liên hệ" },
    ];

    return (
        <Menu
            theme={theme}
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={[
                ...menuItems.map((item) => ({
                    key: item.key,
                    icon: item.icon,
                    label: item.label,
                    onClick: () => navigate(item.key),
                })),
                {
                    key: "theme",
                    label: (
                        <Switch
                            checked={theme === "light"}
                            onChange={toggleTheme}
                            checkedChildren="Sáng"
                            unCheckedChildren="Tối"
                        />
                    ),
                    style: { marginLeft: "auto" },
                },
                {
                    key: "user",
                    label: user ? user.fullname : "Đăng nhập",
                    icon: <UserOutlined />,
                    children: user
                        ? [
                            { key: "profile", label: "Thông Tin", onClick: () => navigate("/customer/profile") },
                            { key: "history", label: "Lịch sử mua hàng", onClick: () => navigate("/customer/history") },
                            { key: "logout", label: "Đăng Xuất", onClick: handleLogout },
                        ]
                        : [
                            { key: "login", label: "Đăng nhập", onClick: () => navigate("/customer/login") },
                            { key: "register", label: "Đăng ký", onClick: () => navigate("/customer/register") },
                        ],
                },
            ]}
            style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}
        />
    );
};

const CustomerHome = () => {
    const { theme } = useContext(ThemeContext);
    const [services, setServices] = useState([]);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            NProgress.start();
            try {
                const token = localStorage.getItem("token");
                const [servicesResponse, productsResponse] = await Promise.all([
                    axios.get("/api/services?page=1&limit=4", {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get("/api/products?page=1&limit=4", {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                ]);
                setServices(servicesResponse.data.data || []);
                setProducts(productsResponse.data.data || []);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
                message.error("Không thể tải danh sách dịch vụ hoặc sản phẩm. Vui lòng thử lại sau!");
            } finally {
                NProgress.done();
            }
        };
        fetchData();
    }, []);

    return (
        <div
            style={{
                background: "var(--background-color)",
                minHeight: "100vh",
            }}
        >
            <div
                style={{
                    padding: "clamp(20px, 5vw, 80px) clamp(20px, 5vw, 50px)",
                }}
            >
                {/* Phần "Chăm sóc thú cưng với sự tận tâm nhất!" */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        background: "var(--modal-bg)",
                        padding: "clamp(20px, 5vw, 50px)",
                        borderRadius: "10px",
                        marginBottom: "40px",
                        gap: "20px",
                    }}
                >
                    <div
                        style={{
                            flex: 1,
                            color: "var(--text-color)",
                            minWidth: "250px",
                            textAlign: "left", // Căn trái
                        }}
                    >
                        <Title
                            level={1}
                            style={{
                                color: "var(--text-color)",
                                fontSize: "clamp(24px, 5vw, 32px)",
                                textAlign: "left", // Căn trái
                            }}
                        >
                            Chăm sóc thú cưng với sự tận tâm nhất! 🐾
                        </Title>
                        <Paragraph
                            style={{
                                color: "var(--text-color)",
                                fontSize: "clamp(14px, 3vw, 16px)",
                                textAlign: "left", // Căn trái
                            }}
                        >
                            Hãy để chúng tôi giúp bạn chăm sóc thú cưng với các dịch vụ tốt nhất.
                        </Paragraph>
                        <Button
                            type="primary"
                            onClick={() => navigate("/customer/services")}
                        >
                            Khám phá ngay
                        </Button>
                    </div>
                    <Image
                        src={background}
                        style={{
                            width: "100%",
                            maxWidth: "400px",
                            borderRadius: "10px",
                            objectFit: "cover",
                        }}
                    />
                </div>

                {/* Phần "Về Pet Haven" */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        marginBottom: "40px",
                        gap: "20px",
                    }}
                >
                    <div
                        style={{
                            flex: 1,
                            color: "var(--text-color)",
                            minWidth: "250px",
                            textAlign: "left", // Căn trái
                        }}
                    >
                        <Title
                            level={2}
                            style={{
                                color: "var(--text-color)",
                                fontSize: "clamp(20px, 4vw, 28px)",
                                textAlign: "left", // Căn trái
                            }}
                        >
                            Về Pet Haven 🏡
                        </Title>
                        <Paragraph
                            style={{
                                color: "var(--text-color)",
                                fontSize: "clamp(14px, 3vw, 16px)",
                                textAlign: "left", // Căn trái
                            }}
                        >
                            Pet Haven là nơi mang đến những dịch vụ chăm sóc thú cưng tốt nhất, từ thức ăn chất lượng, spa, đến dịch vụ y tế và tư vấn sức khỏe.
                        </Paragraph>
                        <Paragraph
                            style={{
                                color: "var(--text-color)",
                                fontSize: "clamp(14px, 3vw, 16px)",
                                textAlign: "left", // Căn trái
                            }}
                        >
                            Chúng tôi cam kết cung cấp những sản phẩm và dịch vụ tốt nhất để đảm bảo thú cưng của bạn luôn khỏe mạnh và hạnh phúc.
                        </Paragraph>
                    </div>
                    <Image
                        src={haven}
                        style={{
                            width: "100%",
                            maxWidth: "400px",
                            borderRadius: "10px",
                            objectFit: "cover",
                        }}
                    />
                </div>

                {/* Phần "Dịch vụ nổi bật" */}
                <div style={{ marginBottom: "40px" }}>
                    <Title
                        level={2}
                        style={{
                            color: "var(--text-color)",
                            fontSize: "clamp(20px, 4vw, 28px)",
                            textAlign: "left", // Căn trái
                        }}
                    >
                        Dịch vụ nổi bật 🏆
                    </Title>
                    {services.length === 0 ? (
                        <Paragraph
                            style={{
                                color: "var(--text-color)",
                                fontSize: "clamp(14px, 3vw, 16px)",
                                textAlign: "left", // Căn trái
                            }}
                        >
                            Hiện không có dịch vụ nào để hiển thị.
                        </Paragraph>
                    ) : (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                                gap: "20px",
                            }}
                        >
                            {services.map((service) => (
                                <Card
                                    key={service._id}
                                    style={{
                                        background: "var(--table-bg)",
                                        padding: "20px",
                                    }}
                                >
                                    <i
                                        className="fa-solid fa-paw"
                                        style={{
                                            fontSize: "clamp(20px, 5vw, 24px)",
                                            color: "#FF8C00",
                                        }}
                                    ></i>
                                    <Title
                                        level={4}
                                        style={{
                                            color: "var(--text-color)",
                                            fontSize: "clamp(16px, 3vw, 20px)",
                                            textAlign: "left", // Căn trái
                                        }}
                                    >
                                        {service.nameService || "Không có tên"}
                                    </Title>
                                    <Paragraph
                                        style={{
                                            color: "var(--text-color)",
                                            fontSize: "clamp(12px, 2.5vw, 14px)",
                                            textAlign: "left", // Căn trái
                                        }}
                                    >
                                        {service.describe || "Chưa có mô tả"}
                                    </Paragraph>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Phần "Sản phẩm nổi bật" */}
                <div style={{ marginBottom: "40px" }}>
                    <Title
                        level={2}
                        style={{
                            color: "var(--text-color)",
                            fontSize: "clamp(20px, 4vw, 28px)",
                            textAlign: "left", // Căn trái
                        }}
                    >
                        Sản phẩm nổi bật 🛍️
                    </Title>
                    {products.length === 0 ? (
                        <Paragraph
                            style={{
                                color: "var(--text-color)",
                                fontSize: "clamp(14px, 3vw, 16px)",
                                textAlign: "left", // Căn trái
                            }}
                        >
                            Hiện không có sản phẩm nào để hiển thị.
                        </Paragraph>
                    ) : (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                                gap: "20px",
                            }}
                        >
                            {products.map((product) => (
                                <Card
                                    key={product._id}
                                    hoverable
                                    style={{
                                        background: "var(--table-bg)",
                                        padding: "20px",
                                    }}
                                >
                                    <Image
                                        src={product.picture || "https://via.placeholder.com/150"}
                                        height={150}
                                        style={{
                                            width: "100%",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                        }}
                                    />
                                    <Title
                                        level={4}
                                        style={{
                                            color: "var(--text-color)",
                                            fontSize: "clamp(16px, 3vw, 20px)",
                                            textAlign: "left", // Căn trái
                                        }}
                                    >
                                        {product.name || "Không có tên"}
                                    </Title>
                                    <Paragraph
                                        style={{
                                            color: "var(--text-color)",
                                            fontSize: "clamp(12px, 2.5vw, 14px)",
                                            textAlign: "left", // Căn trái
                                        }}
                                    >
                                        {product.category || "Không xác định"}
                                    </Paragraph>
                                    <Paragraph
                                        style={{
                                            color: "#FFD700",
                                            fontSize: "clamp(12px, 2.5vw, 14px)",
                                            textAlign: "left", // Căn trái
                                        }}
                                    >
                                        {product.price ? product.price.toLocaleString() : "0"} VND
                                    </Paragraph>
                                    <Button
                                        type="primary"
                                        onClick={() => navigate("/customer/foods")}
                                    >
                                        Mua ngay
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Phần "Khách hàng nói gì về chúng tôi?" */}
                <div style={{ marginBottom: "40px" }}>
                    <Title
                        level={2}
                        style={{
                            color: "var(--text-color)",
                            fontSize: "clamp(20px, 4vw, 28px)",
                            textAlign: "left", // Căn trái
                        }}
                    >
                        Khách hàng nói gì về chúng tôi? 🐾
                    </Title>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                            gap: "20px",
                        }}
                    >
                        <Card
                            style={{
                                background: "var(--table-bg)",
                                padding: "20px",
                            }}
                        >
                            <Paragraph
                                style={{
                                    color: "var(--text-color)",
                                    fontSize: "clamp(12px, 2.5vw, 14px)",
                                    textAlign: "left", // Căn trái
                                }}
                            >
                                "Dịch vụ chăm sóc thú cưng ở đây thật tuyệt vời! Nhân viên rất thân thiện và chuyên nghiệp!"
                            </Paragraph>
                            <Title
                                level={5}
                                style={{
                                    color: "var(--text-color)",
                                    fontSize: "clamp(14px, 3vw, 16px)",
                                    textAlign: "left", // Căn trái
                                }}
                            >
                                - Nguyễn Văn A
                            </Title>
                        </Card>
                        <Card
                            style={{
                                background: "var(--table-bg)",
                                padding: "20px",
                            }}
                        >
                            <Paragraph
                                style={{
                                    color: "var(--text-color)",
                                    fontSize: "clamp(12px, 2.5vw, 14px)",
                                    textAlign: "left", // Căn trái
                                }}
                            >
                                "Chó cưng của tôi được tắm và cắt tỉa lông rất đẹp, chắc chắn sẽ quay lại!"
                            </Paragraph>
                            <Title
                                level={5}
                                style={{
                                    color: "var(--text-color)",
                                    fontSize: "clamp(14px, 3vw, 16px)",
                                    textAlign: "left", // Căn trái
                                }}
                            >
                                - Trần Thị B
                            </Title>
                        </Card>
                        <Card
                            style={{
                                background: "var(--table-bg)",
                                padding: "20px",
                            }}
                        >
                            <Paragraph
                                style={{
                                    color: "var(--text-color)",
                                    fontSize: "clamp(12px, 2.5vw, 14px)",
                                    textAlign: "left", // Căn trái
                                }}
                            >
                                "Thức ăn và phụ kiện chất lượng cao, giá cả hợp lý, rất đáng để trải nghiệm!"
                            </Paragraph>
                            <Title
                                level={5}
                                style={{
                                    color: "var(--text-color)",
                                    fontSize: "clamp(14px, 3vw, 16px)",
                                    textAlign: "left", // Căn trái
                                }}
                            >
                                - Lê Văn C
                            </Title>
                        </Card>
                    </div>
                </div>

                {/* Phần "Câu hỏi thường gặp" */}
                <div style={{ marginBottom: "40px" }}>
                    <Title
                        level={2}
                        style={{
                            color: "var(--text-color)",
                            fontSize: "clamp(20px, 4vw, 28px)",
                            textAlign: "left", // Căn trái
                        }}
                    >
                        Câu hỏi thường gặp ❓
                    </Title>
                    <Card
                        style={{
                            background: "var(--table-bg)",
                            padding: "20px",
                        }}
                    >
                        <div style={{ marginBottom: "16px" }}>
                            <Title
                                level={4}
                                style={{
                                    color: "var(--text-color)",
                                    fontSize: "clamp(16px, 3vw, 20px)",
                                    textAlign: "left", // Căn trái
                                }}
                            >
                                Tôi có thể đặt hàng trước bao lâu? <span>+</span>
                            </Title>
                            <Paragraph
                                style={{
                                    color: "var(--text-color)",
                                    fontSize: "clamp(12px, 2.5vw, 14px)",
                                    textAlign: "left", // Căn trái
                                }}
                            >
                                Bạn có thể đặt hàng bất kỳ lúc nào, chúng tôi sẽ xử lý trong vòng 24 giờ.
                            </Paragraph>
                        </div>
                        <div style={{ marginBottom: "16px" }}>
                            <Title
                                level={4}
                                style={{
                                    color: "var(--text-color)",
                                    fontSize: "clamp(16px, 3vw, 20px)",
                                    textAlign: "left", // Căn trái
                                }}
                            >
                                Cửa hàng có bán thức ăn cho mọi loại thú cưng không? <span>+</span>
                            </Title>
                            <Paragraph
                                style={{
                                    color: "var(--text-color)",
                                    fontSize: "clamp(12px, 2.5vw, 14px)",
                                    textAlign: "left", // Căn trái
                                }}
                            >
                                Chúng tôi cung cấp đa dạng thức ăn cho chó, mèo và một số vật nuôi khác.
                            </Paragraph>
                        </div>
                        <div>
                            <Title
                                level={4}
                                style={{
                                    color: "var(--text-color)",
                                    fontSize: "clamp(16px, 3vw, 20px)",
                                    textAlign: "left", // Căn trái
                                }}
                            >
                                Có dịch vụ giao hàng tận nơi không? <span>+</span>
                            </Title>
                            <Paragraph
                                style={{
                                    color: "var(--text-color)",
                                    fontSize: "clamp(12px, 2.5vw, 14px)",
                                    textAlign: "left", // Căn trái
                                }}
                            >
                                Chúng tôi hỗ trợ giao hàng tận nơi trong phạm vi 10km từ cửa hàng.
                            </Paragraph>
                        </div>
                    </Card>
                </div>

                {/* Phần Call-to-Action cuối */}
                <div
                    style={{
                        background: "var(--modal-bg)",
                        padding: "clamp(20px, 5vw, 50px)",
                        textAlign: "center",
                        borderRadius: "10px",
                    }}
                >
                    <Title
                        level={2}
                        style={{
                            color: "var(--text-color)",
                            fontSize: "clamp(20px, 4vw, 28px)",
                            textAlign: "center", // Giữ căn giữa cho phần này
                        }}
                    >
                        Hãy chăm sóc thú cưng của bạn ngay hôm nay!
                    </Title>
                    <Paragraph
                        style={{
                            color: "var(--text-color)",
                            fontSize: "clamp(14px, 3vw, 16px)",
                            textAlign: "center", // Giữ căn giữa cho phần này
                        }}
                    >
                        Đặt hàng ngay để thú cưng của bạn được hưởng dịch vụ và sản phẩm tốt nhất.
                    </Paragraph>
                    <Button
                        type="primary"
                        onClick={() => navigate("/customer/services")}
                    >
                        Đặt hàng ngay
                    </Button>
                </div>
            </div>
        </div>
    );
};

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

const CustomerCart = () => {
    const { theme } = useContext(ThemeContext);
    const [cart, setCart] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [bankInfo, setBankInfo] = useState(null);
    const [orderId, setOrderId] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    const loadCart = () => {
        const cartData = JSON.parse(localStorage.getItem("cart")) || [];
        const formattedCart = cartData.map((item) => ({
            ...item,
            date: item.date && moment(item.date, "YYYY-MM-DD", true).isValid() ? item.date : null,
        }));
        setCart(formattedCart);
    };

    useEffect(() => {
        loadCart();
    }, []);

    const generateVietQR = (orderId, total) => {
        const bankId = "970422";
        const accountNo = "0905859265";
        const template = "compact";
        const accountNameRaw = "NGUYEN DUC LEN";
        const accountName = encodeURIComponent(accountNameRaw);
        const amount = Math.floor(parseInt(total, 10));
        const shortOrderId = orderId.slice(0, 10);
        const descriptionRaw = `Thanh toan don hang ${shortOrderId}`;
        const description = encodeURIComponent(descriptionRaw).replace(/[^a-zA-Z0-9%]/g, "").slice(0, 50);

        if (!bankId.match(/^\d+$/) || !accountNo.match(/^[a-zA-Z0-9]{1,19}$/)) {
            message.error("Thông tin ngân hàng không hợp lệ!");
            return null;
        }
        if (amount <= 0 || isNaN(amount)) {
            message.error("Số tiền không hợp lệ!");
            return null;
        }
        if (descriptionRaw.length > 50) {
            message.error("Nội dung chuyển khoản quá dài (tối đa 50 ký tự)!");
            return null;
        }

        const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${amount}&addInfo=${description}&accountName=${accountName}`;
        console.log("URL VietQR được tạo:", qrUrl);
        console.log("Thông tin VietQR:", { bankId, accountNo, template, amount, description: descriptionRaw, accountName: accountNameRaw });

        return { qrUrl, bankInfo: { bankId, accountNo, accountName: accountNameRaw, shortOrderId } };
    };

    const checkPaymentStatus = async (orderId, total) => {
        try {
            if (!orderId) {
                console.error("orderId không hợp lệ:", orderId);
                return false;
            }

            const response = await fetch('http://localhost:3002/api/vietqr', {
                method: "GET",
                headers: {
                    "Cache-Control": "no-cache",
                    "Pragma": "no-cache",
                    "Expires": "0",
                },
            });
            if (!response.ok) {
                console.error("Lỗi HTTP:", response.status);
                message.error(`Lỗi khi kiểm tra thanh toán: HTTP ${response.status}`);
                return false;
            }
            const result = await response.json();
            console.log("Dữ liệu từ VietQR API:", result);

            if (result.error) {
                console.error("API trả về lỗi:", result);
                message.error("Lỗi khi kiểm tra thanh toán từ VietQR: " + result.error);
                return false;
            }

            const transactions = result.data.filter(item => item["Mã GD"] !== "Mã GD");
            console.log("Giao dịch:", transactions);

            const normalizedOrderId = orderId.toUpperCase();
            const shortOrderId = normalizedOrderId.slice(0, 10);
            const matchingTransaction = transactions.find((tx) => {
                const description = tx["Mô tả"].toUpperCase();
                const price = parseInt(tx["Giá trị"]);
                const account = tx["Số tài khoản"];
                console.log("So sánh giao dịch:", {
                    description,
                    shortOrderId,
                    price,
                    total: parseInt(total),
                    account
                });
                return (
                    description.includes(shortOrderId) &&
                    price >= parseInt(total) &&
                    account === "0905859265"
                );
            });

            console.log("Kiểm tra khớp:", { shortOrderId, total, matchingTransaction });
            return !!matchingTransaction;
        } catch (error) {
            console.error("Lỗi kiểm tra thanh toán:", error);
            message.error("Lỗi kiểm tra thanh toán: " + error.message);
            return false;
        }
    };

    const handleSuccessfulPayment = async (orderId, paidCart) => {
        const userData = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");
        try {
            await axios.put(`/api/orders/${orderId}`, {
                status: "Đã thanh toán",
                updatedAt: new Date().toISOString(),
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const appointmentPromises = (paidCart || []).map((item) => {
                if (item.type === "service") {
                    const appointment = {
                        fullname: userData.fullname || "",
                        phone: userData.phone || "",
                        date: item.date,
                        service: item.name || "Không có tên",
                        status: "Chờ xác nhận",
                        userId: userData._id,
                    };
                    return axios.post("/api/appointments", appointment, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                }
                return Promise.resolve();
            });

            await Promise.all(appointmentPromises);
            localStorage.removeItem("cart");
            setCart([]);
            setQrCodeUrl(null);
            setBankInfo(null);
            setOrderId(null);
            setIsProcessing(false);
            message.success("Thanh toán thành công!");
            navigate("/customer/history");
        } catch (error) {
            console.error("Lỗi xử lý thanh toán thành công:", error);
            message.error("Lỗi khi hoàn tất thanh toán!");
            setIsProcessing(false);
        }
    };

    const checkout = async () => {
        const token = localStorage.getItem("token");
        const userData = JSON.parse(localStorage.getItem("user"));

        if (!token || !userData || !userData._id || !userData.role) {
            message.error("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại!");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/customer/login");
            return;
        }

        console.log("User Data:", userData);
        console.log("Role:", userData.role);

        // Verify token with server
        try {
            const response = await axios.get("/api/users/me", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const serverUserData = response.data.data;
            if (serverUserData._id !== userData._id || serverUserData.role !== userData.role) {
                console.error("User data mismatch:", { local: userData, server: serverUserData });
                message.error("Thông tin người dùng không đồng bộ. Vui lòng đăng nhập lại!");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/customer/login");
                return;
            }
        } catch (error) {
            console.error("Error verifying user:", error);
            message.error("Không thể xác thực người dùng. Vui lòng đăng nhập lại!");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/customer/login");
            return;
        }

        if (cart.length === 0) {
            message.error("Giỏ hàng trống!");
            return;
        }

        const hasMissingDate = cart.some((item) => item.type === "service" && !item.date);
        if (hasMissingDate) {
            message.error("Vui lòng nhập ngày cho dịch vụ!");
            return;
        }

        const hasInvalidDate = cart.some((item) => {
            if (item.type === "service") {
                const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                if (!dateRegex.test(item.date) || !moment(item.date, "YYYY-MM-DD", true).isValid() || moment(item.date).isBefore(moment().startOf("day"))) {
                    message.error(`Ngày của dịch vụ ${item.name} không hợp lệ!`);
                    return true;
                }
            }
            return false;
        });

        if (hasInvalidDate) return;

        setIsProcessing(true);

        const foodItems = cart.filter((item) => item.type === "food");
        for (const item of foodItems) {
            try {
                const response = await axios.get(`/api/products/${item.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const foodData = response.data.data;
                if (!foodData) {
                    message.error(`Món ăn ${item.name} không tồn tại!`);
                    setIsProcessing(false);
                    return;
                }
                const currentQuantity = foodData.quantity || 0;
                const requestedQuantity = item.quantity || 1;

                if (currentQuantity < requestedQuantity) {
                    message.error(`Số lượng ${item.name} không đủ! Còn ${currentQuantity} sản phẩm.`);
                    setIsProcessing(false);
                    return;
                }
            } catch (error) {
                console.error("Lỗi kiểm tra sản phẩm:", error);
                message.error(`Lỗi khi kiểm tra món ăn ${item.name}!`);
                setIsProcessing(false);
                return;
            }
        }

        const order = {
            userId: userData._id.toString(),
            userFullname: userData.fullname || "",
            userPhone: userData.phone || "",
            items: cart.map((item) => ({
                id: item.id,
                name: item.name || "Không có tên",
                picture: item.picture || "",
                quantity: item.quantity || 1,
                type: item.type || "food"
            })),
            total: cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0).toString(),
            timestamp: new Date().toISOString(),
            status: paymentMethod === "COD" ? "Chờ xử lý" : "Chờ thanh toán",
            paymentMethod,
        };

        console.log("Order Data gửi lên:", JSON.stringify(order, null, 2));

        try {
            const response = await axios.post("/api/orders", order, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Order response:", response.data);
            const orderId = response.data.data._id;
            setOrderId(orderId);

            const updatePromises = foodItems.map(async (item) => {
                const foodResponse = await axios.get(`/api/products/${item.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const currentQuantity = foodResponse.data.data.quantity || 0;
                const requestedQuantity = item.quantity || 1;
                await axios.put(`/api/products/${item.id}`, {
                    quantity: currentQuantity - requestedQuantity,
                    updatedAt: new Date().toISOString(),
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (currentQuantity - requestedQuantity <= 0) {
                    await axios.put(`/api/products/${item.id}`, {
                        status: "Hết hàng",
                        updatedAt: new Date().toISOString(),
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                }
            });

            await Promise.all(updatePromises);

            if (paymentMethod === "VietQR") {
                NProgress.start();
                const result = generateVietQR(orderId, order.total);
                if (!result) {
                    setIsProcessing(false);
                    return;
                }
                setQrCodeUrl(result.qrUrl);
                setBankInfo(result.bankInfo);
                NProgress.done();
                message.info("Quét mã QR để thanh toán!");

                let checkInterval;
                checkInterval = setInterval(async () => {
                    try {
                        if (!orderId) {
                            clearInterval(checkInterval);
                            return;
                        }
                        const isPaid = await checkPaymentStatus(orderId, order.total);
                        if (isPaid) {
                            clearInterval(checkInterval);
                            await handleSuccessfulPayment(orderId, cart);
                        }
                    } catch (error) {
                        console.error("Lỗi trong interval kiểm tra thanh toán:", error);
                        clearInterval(checkInterval);
                        setIsProcessing(false);
                        setQrCodeUrl(null);
                        setBankInfo(null);
                        setOrderId(null);
                        message.error("Lỗi khi kiểm tra trạng thái thanh toán!");
                    }
                }, 2000);

                const timeout = setTimeout(() => {
                    clearInterval(checkInterval);
                    if (qrCodeUrl) {
                        message.warning("Hết thời gian chờ thanh toán!");
                        setQrCodeUrl(null);
                        setBankInfo(null);
                        setOrderId(null);
                        setIsProcessing(false);
                    }
                }, 10 * 60 * 1000);

                return () => {
                    clearInterval(checkInterval);
                    clearTimeout(timeout);
                };
            } else {
                const appointmentPromises = cart.map((item) => {
                    if (item.type === "service") {
                        const appointment = {
                            fullname: userData.fullname || "",
                            phone: userData.phone || "",
                            date: item.date,
                            service: item.name || "Không có tên",
                            status: "Chờ xác nhận",
                            userId: userData._id,
                        };
                        return axios.post("/api/appointments", appointment, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                    }
                    return Promise.resolve();
                });
                await Promise.all(appointmentPromises);
                localStorage.removeItem("cart");
                setCart([]);
                setIsProcessing(false);
                message.success("Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng.");
                navigate("/customer/history");
            }
        } catch (error) {
            console.error("Lỗi đặt hàng:", error.response?.data || error.message);
            message.error(error.response?.data?.error || "Lỗi khi đặt hàng! Vui lòng thử lại.");
            setIsProcessing(false);
        }
    };

    const updateQuantity = (index, quantity) => {
        let updatedCart = [...cart];
        quantity = Math.max(1, parseInt(quantity));
        updatedCart[index].quantity = quantity;
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCart(updatedCart);
    };

    const updateDate = (index, date) => {
        let updatedCart = [...cart];
        updatedCart[index].date = date || null;
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCart(updatedCart);
    };

    const removeItem = (index) => {
        let updatedCart = [...cart];
        updatedCart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCart(updatedCart);
    };

    const total = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

    return (
        <div style={{ padding: "80px 50px", background: "var(--background-color)", minHeight: "100vh" }}>
            <Title level={2} style={{ color: "var(--text-color)" }}>
                Giỏ Hàng 🛒
            </Title>
            <Paragraph style={{ color: "var(--text-color)" }}>
                Xem và quản lý các sản phẩm bạn đã chọn!
            </Paragraph>
            {cart.length === 0 ? (
                <Paragraph style={{ color: "var(--text-color)" }}>
                    Giỏ hàng của bạn trống!
                </Paragraph>
            ) : (
                <>
                    <Form.Item label="Phương thức thanh toán">
                        <Select value={paymentMethod} onChange={setPaymentMethod} disabled={isProcessing}>
                            <Select.Option value="COD">Thanh toán khi nhận hàng</Select.Option>
                            <Select.Option value="VietQR">Thanh toán qua VietQR</Select.Option>
                        </Select>
                    </Form.Item>
                    {cart.map((item, index) => (
                        <Card key={index} style={{ marginBottom: 16, background: "var(--table-bg)" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Image src={item.picture || "https://via.placeholder.com/100"} width={100} style={{ borderRadius: 8 }} />
                                <div style={{ flex: 1, marginLeft: 16, color: "var(--text-color)" }}>
                                    <Paragraph style={{ color: "var(--text-color)" }}>
                                        {item.name || "Không có tên"}
                                    </Paragraph>
                                    <Paragraph style={{ color: "var(--text-color)" }}>
                                        {item.type === "service" ? "Dịch vụ" : "Thức ăn"}
                                    </Paragraph>
                                    <Paragraph style={{ color: "#FFD700" }}>
                                        {(item.price || 0).toLocaleString()} VND
                                    </Paragraph>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <InputNumber
                                        min={1}
                                        value={item.quantity || 1}
                                        onChange={(value) => updateQuantity(index, value)}
                                        disabled={isProcessing}
                                    />
                                    {item.type === "service" && (
                                        <Input
                                            value={item.date || ""}
                                            onChange={(e) => updateDate(index, e.target.value)}
                                            placeholder="Nhập ngày (YYYY-MM-DD)"
                                            style={{ width: 150 }}
                                            disabled={isProcessing}
                                        />
                                    )}
                                    <Button danger icon={<DeleteOutlined />} onClick={() => removeItem(index)} disabled={isProcessing} />
                                </div>
                            </div>
                        </Card>
                    ))}
                    {paymentMethod === "VietQR" && qrCodeUrl && (
                        <Card style={{ marginBottom: 16, background: "var(--table-bg)", textAlign: "center" }}>
                            <Title level={4} style={{ color: "var(--text-color)" }}>
                                Quét mã QR để thanh toán
                            </Title>
                            <img src={qrCodeUrl} alt="VietQR Code" style={{ width: 400, height: 400 }} />
                            <Paragraph style={{ color: "var(--text-color)" }}>
                                Sử dụng ứng dụng ngân hàng để quét mã QR.
                            </Paragraph>
                            {bankInfo && (
                                <div style={{ margin: "0 auto", width: "100%", maxWidth: "500px", textAlign: "left" }}>
                                    <Paragraph style={{ color: "var(--text-color)", textAlign: "left" }}>
                                        Hoặc chuyển khoản đến<br />
                                        SỐ TÀI KHOẢN: <span
                                            style={{
                                                fontWeight: "bold",
                                                backgroundColor: "#f0f0f0",
                                                padding: "2px 6px",
                                                marginLeft: 4,
                                                marginRight: 8,
                                                borderRadius: 4,
                                                cursor: "pointer"
                                            }}
                                            onClick={() => {
                                                navigator.clipboard.writeText(bankInfo.accountNo);
                                                message.success("Đã copy Số tài khoản");
                                            }}
                                            title="Nhấn để sao chép"
                                        >
                                            {bankInfo.accountNo}
                                        </span><br />
                                        MÃ GIAO DỊCH: <span
                                            style={{
                                                fontWeight: "bold",
                                                backgroundColor: "#f0f0f0",
                                                padding: "0px 6px",
                                                marginLeft: 4,
                                                marginRight: 8,
                                                borderRadius: 4,
                                                cursor: "pointer"
                                            }}
                                            onClick={() => {
                                                navigator.clipboard.writeText(bankInfo.shortOrderId);
                                                message.success("Đã copy mã đơn hàng");
                                            }}
                                            title="Nhấn để sao chép"
                                        >
                                            {bankInfo.shortOrderId}
                                        </span><br />
                                        SỐ TIỀN: <strong style={{ color: "green", fontWeight: "bold", fontSize: "16px" }}>
                                            {new Intl.NumberFormat("vi-VN", {
                                                style: "currency",
                                                currency: "VND"
                                            }).format(total)}
                                        </strong><br />
                                        NGÂN HÀNG: <strong>MB BANK</strong><br />
                                        CHỦ TÀI KHOẢN: <strong>{bankInfo.accountName}</strong>
                                    </Paragraph>
                                </div>
                            )}
                            <Paragraph style={{ color: "var(--text-color)" }}>
                                Đơn hàng sẽ hoàn tất sau khi thanh toán. Đang chờ xác nhận thanh toán...
                            </Paragraph>
                        </Card>
                    )}
                    <Card
                        style={{
                            position: "fixed",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            background: "var(--modal-bg)",
                            zIndex: 1000,
                            boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "calc(100% - 100px)",
                                margin: "0 auto",
                                padding: "10px 0",
                            }}
                        >
                            <span style={{ color: "var(--text-color)", fontSize: "16px", fontWeight: "bold" }}>
                                Tổng cộng: {total.toLocaleString()} VND
                            </span>
                            <Button
                                type="primary"
                                onClick={checkout}
                                disabled={cart.length === 0 || isProcessing}
                                loading={isProcessing}
                            >
                                Thanh Toán
                            </Button>
                        </div>
                    </Card>
                </>
            )}
        </div>
    );
};

const CustomerLogin = () => {
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        try {
            const response = await axios.post("/api/auth/login", {
                email: values.email,
                password: values.password,
            });
            // Sửa để truy cập đúng định dạng phản hồi từ backend
            const { token, user } = response.data.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            console.log("Stored User Data:", user);
            message.success("Đăng nhập thành công!");
            navigate("/customer/home");
        } catch (error) {
            console.error("Login error:", error);
            message.error(error.response?.data?.error || "Email hoặc mật khẩu không đúng!");
        }
    };

    return (
        <div style={{ padding: "40px 20px", background: "var(--background-color)", minHeight: "100vh" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <Title level={2} style={{ color: "var(--text-color)", textAlign: "center", marginBottom: 24 }}>
                    Đăng nhập
                </Title>
                <Card style={{ maxWidth: 600, margin: "0 auto", background: "var(--modal-bg)" }}>
                    <Form onFinish={handleSubmit} layout="vertical">
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
                        >
                            <Input placeholder="Nhập email của bạn" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu" />
                        </Form.Item>
                        <Form.Item style={{ textAlign: "center" }}>
                            <Button type="primary" htmlType="submit" block>
                                Đăng nhập
                            </Button>
                        </Form.Item>
                        <div style={{ textAlign: "center" }}>
                            <a href="#" onClick={() => message.info("Tính năng quên mật khẩu chưa được triển khai.")}>
                                Quên mật khẩu?
                            </a>
                            <br />
                            <a onClick={() => navigate("/customer/register")}>Đăng ký tài khoản</a>
                        </div>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

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
        const phoneRegex = /^\+?[1-9]\d{8,14}$/;
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

const CustomerContact = () => {
    const { theme } = useContext(ThemeContext);

    return (
        <div style={{ padding: "80px 50px", background: "var(--background-color)", minHeight: "100vh", textAlign: "center" }}>
            <Title level={2} style={{ color: "var(--text-color)" }}>
                Liên Hệ Chúng Tôi
            </Title>
            <Paragraph style={{ color: "var(--text-color)" }}>
                Hãy liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ.
            </Paragraph>
            <Card style={{ maxWidth: 800, margin: "20px auto", background: "var(--modal-bg)" }}>
                <div style={{ marginBottom: "20px" }}>
                    <Paragraph style={{ color: "var(--text-color)" }}>
                        <i className="fas fa-university" style={{ marginRight: 10, color: "#FF8C00" }}></i> Sinh Viên Sư Phạm
                    </Paragraph>
                    <Paragraph style={{ color: "var(--text-color)" }}>
                        <i className="fas fa-map-marker-alt" style={{ marginRight: 10, color: "#FF8C00" }}></i> 459 Tôn Đức Thắng, Hòa Khánh Nam, Liên Chiểu District, Đà Nẵng
                    </Paragraph>
                    <Paragraph style={{ color: "var(--text-color)" }}>
                        <i className="fas fa-phone" style={{ marginRight: 10, color: "#FF8C00" }}></i> 0236.3.841.323
                    </Paragraph>
                    <Paragraph style={{ color: "var(--text-color)" }}>
                        <i className="fas fa-envelope" style={{ marginRight: 10, color: "#FF8C00" }}></i> <a href="mailto:contact@pethaven.com">contact@pethaven.com</a>
                    </Paragraph>
                </div>
                <div style={{ borderRadius: "10px", overflow: "hidden", boxShadow: "0 4px 8px rgba(255, 255, 255, 0.1)" }}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.070911670863!2d108.15885113064721!3d16.061809606530108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219247957db31%3A0x66e813ac01165274!2zNDU5IFTDtG4gxJDhu6ljIFRo4bqvbmcsIEhvw6AgS2jDoW5oIE5hbSwgTGnDqm4gQ2hp4buDdSwgxJDJoCBO4bq1bmcgNTUwMDAwLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1741845938489!5m2!1svi!2s"
                        width="100%"
                        height="400"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </Card>
        </div>
    );
};

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
                const response = await axios.get("/api/orders/my-orders");
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

const CustomerApp = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    await axios.get("/api/users/me");
                }
            } catch (error) {
                console.error("Error checking auth:", error);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    if (isLoading) return <Spin size="large" style={{ display: "block", margin: "50px auto" }} />;

    return (
        <div style={{ minHeight: "100vh", background: "var(--background-color)" }}>
            <CustomerNavbar />
            <Routes>
                <Route path="/home" element={<CustomerHome />} />
                <Route path="/services" element={<CustomerServices />} />
                <Route path="/foods" element={<CustomerFoods />} />
                <Route path="/cart" element={<CustomerCart />} />
                <Route path="/login" element={<CustomerLogin />} />
                <Route path="/register" element={<CustomerRegister />} />
                <Route path="/profile" element={<CustomerProfile />} />
                <Route path="/contact" element={<CustomerContact />} />
                <Route path="/history" element={<CustomerHistory />} />
                <Route path="*" element={<CustomerHome />} />
            </Routes>
        </div>
    );
};

export default CustomerApp;