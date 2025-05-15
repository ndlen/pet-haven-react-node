import React, { useState, useEffect, useContext } from "react";
import { Typography, Card, Image, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
const { Title, Paragraph } = Typography;
import background from "../../assets/images/background.jpg";
import haven from "../../assets/images/haven.jpg";

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
                            textAlign: "left",
                        }}
                    >
                        <Title
                            level={1}
                            style={{
                                color: "var(--text-color)",
                                fontSize: "clamp(24px, 5vw, 32px)",
                                textAlign: "left",
                            }}
                        >
                            Chăm sóc thú cưng với sự tận tâm nhất! 🐾
                        </Title>
                        <Paragraph
                            style={{
                                color: "var(--text-color)",
                                fontSize: "clamp(14px, 3vw, 16px)",
                                textAlign: "left",
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
                        src={background} // Placeholder for background image
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
                            textAlign: "left",
                        }}
                    >
                        <Title
                            level={2}
                            style={{
                                color: "var(--text-color)",
                                fontSize: "clamp(20px, 4vw, 28px)",
                                textAlign: "left",
                            }}
                        >
                            Về Pet Haven 🏡
                        </Title>
                        <Paragraph
                            style={{
                                color: "var(--text-color)",
                                fontSize: "clamp(14px, 3vw, 16px)",
                                textAlign: "left",
                            }}
                        >
                            Pet Haven là nơi mang đến những dịch vụ chăm sóc thú cưng tốt nhất, từ thức ăn chất lượng, spa, đến dịch vụ y tế và tư vấn sức khỏe.
                        </Paragraph>
                        <Paragraph
                            style={{
                                color: "var(--text-color)",
                                fontSize: "clamp(14px, 3vw, 16px)",
                                textAlign: "left",
                            }}
                        >
                            Chúng tôi cam kết cung cấp những sản phẩm và dịch vụ tốt nhất để đảm bảo thú cưng của bạn luôn khỏe mạnh và hạnh phúc.
                        </Paragraph>
                    </div>
                    <Image
                        src={haven} // Placeholder for haven image
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
                            textAlign: "left",
                        }}
                    >
                        Dịch vụ nổi bật 🏆
                    </Title>
                    {services.length === 0 ? (
                        <Paragraph
                            style={{
                                color: "var(--text-color)",
                                fontSize: "clamp(14px, 3vw, 16px)",
                                textAlign: "left",
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
                                            textAlign: "left",
                                        }}
                                    >
                                        {service.nameService || "Không có tên"}
                                    </Title>
                                    <Paragraph
                                        style={{
                                            color: "var(--text-color)",
                                            fontSize: "clamp(12px, 2.5vw, 14px)",
                                            textAlign: "left",
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
                            textAlign: "left",
                        }}
                    >
                        Sản phẩm nổi bật 🛍️
                    </Title>
                    {products.length === 0 ? (
                        <Paragraph
                            style={{
                                color: "var(--text-color)",
                                fontSize: "clamp(14px, 3vw, 16px)",
                                textAlign: "left",
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
                                            textAlign: "left",
                                        }}
                                    >
                                        {product.name || "Không có tên"}
                                    </Title>
                                    <Paragraph
                                        style={{
                                            color: "var(--text-color)",
                                            fontSize: "clamp(12px, 2.5vw, 14px)",
                                            textAlign: "left",
                                        }}
                                    >
                                        {product.category || "Không xác định"}
                                    </Paragraph>
                                    <Paragraph
                                        style={{
                                            color: "#FFD700",
                                            fontSize: "clamp(12px, 2.5vw, 14px)",
                                            textAlign: "left",
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
                            textAlign: "left",
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
                                    textAlign: "left",
                                }}
                            >
                                "Dịch vụ chăm sóc thú cưng ở đây thật tuyệt vời! Nhân viên rất thân thiện và chuyên nghiệp!"
                            </Paragraph>
                            <Title
                                level={5}
                                style={{
                                    color: "var(--text-color)",
                                    fontSize: "clamp(14px, 3vw, 16px)",
                                    textAlign: "left",
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
                                    textAlign: "left",
                                }}
                            >
                                "Chó cưng của tôi được tắm và cắt tỉa lông rất đẹp, chắc chắn sẽ quay lại!"
                            </Paragraph>
                            <Title
                                level={5}
                                style={{
                                    color: "var(--text-color)",
                                    fontSize: "clamp(14px, 3vw, 16px)",
                                    textAlign: "left",
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
                                    textAlign: "left",
                                }}
                            >
                                "Thức ăn và phụ kiện chất lượng cao, giá cả hợp lý, rất đáng để trải nghiệm!"
                            </Paragraph>
                            <Title
                                level={5}
                                style={{
                                    color: "var(--text-color)",
                                    fontSize: "clamp(14px, 3vw, 16px)",
                                    textAlign: "left",
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
                            textAlign: "left",
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
                                    textAlign: "left",
                                }}
                            >
                                Tôi có thể đặt hàng trước bao lâu? <span>+</span>
                            </Title>
                            <Paragraph
                                style={{
                                    color: "var(--text-color)",
                                    fontSize: "clamp(12px, 2.5vw, 14px)",
                                    textAlign: "left",
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
                                    textAlign: "left",
                                }}
                            >
                                Cửa hàng có bán thức ăn cho mọi loại thú cưng không? <span>+</span>
                            </Title>
                            <Paragraph
                                style={{
                                    color: "var(--text-color)",
                                    fontSize: "clamp(12px, 2.5vw, 14px)",
                                    textAlign: "left",
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
                                    textAlign: "left",
                                }}
                            >
                                Có dịch vụ giao hàng tận nơi không? <span>+</span>
                            </Title>
                            <Paragraph
                                style={{
                                    color: "var(--text-color)",
                                    fontSize: "clamp(12px, 2.5vw, 14px)",
                                    textAlign: "left",
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
                            textAlign: "center",
                        }}
                    >
                        Hãy chăm sóc thú cưng của bạn ngay hôm nay!
                    </Title>
                    <Paragraph
                        style={{
                            color: "var(--text-color)",
                            fontSize: "clamp(14px, 3vw, 16px)",
                            textAlign: "center",
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

export default CustomerHome;