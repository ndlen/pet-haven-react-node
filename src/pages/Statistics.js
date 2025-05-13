import React, { useContext } from "react";
import { Typography } from "antd";
import { ThemeContext } from "../context/ThemeContext";

const { Title } = Typography;

const Statistics = () => {
    const { theme } = useContext(ThemeContext);

    return (
        <div style={{ background: "var(--background-color)" }}>
            <Title level={2} style={{ color: "var(--text-color)" }}>
                Thống kê
            </Title>
            <p style={{ color: "var(--text-color)" }}>
                Đây là trang thống kê. Chức năng này sẽ được triển khai sau.
            </p>
        </div>
    );
};

export default Statistics;