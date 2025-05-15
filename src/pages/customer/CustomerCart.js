import React, { useState, useEffect, useContext } from "react";
import { Typography, Card, Button, Image, Form, Select, InputNumber, Input, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import moment from "moment";
import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
const { Title, Paragraph } = Typography;
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

export default CustomerCart;