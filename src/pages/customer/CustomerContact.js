import React, { useContext } from "react";
import { Typography, Card, message } from "antd";
import { ThemeContext } from "../../context/ThemeContext";
const { Title, Paragraph } = Typography;
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

export default CustomerContact;