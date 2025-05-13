import React from "react";
import { Table, Button, Popconfirm, message } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const CrudTable = ({ data, columns, onEdit, onDelete }) => {
    const actionColumn = {
        title: "Hành động",
        key: "action",
        render: (_, record) => (
            <span>
                <Button type="link" onClick={() => onEdit(record)}>
                    <EditOutlined />
                </Button>
                <Popconfirm
                    title="Bạn có chắc chắn muốn xóa?"
                    onConfirm={() => {
                        onDelete(record);
                        message.success("Xóa thành công!");
                    }}
                    okText="Có"
                    cancelText="Không"
                >
                    <Button type="link" danger>
                        <DeleteOutlined />
                    </Button>
                </Popconfirm>
            </span>
        ),
    };

    return (
        <Table
            columns={[...columns, actionColumn]}
            dataSource={data}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
        />
    );
};

export default CrudTable;