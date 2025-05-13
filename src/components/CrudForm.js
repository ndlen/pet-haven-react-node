import React, { useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker } from "antd";
import moment from "moment";

const { Option } = Select;

const CrudForm = ({ visible, onCancel, onSubmit, initialValues, formType, fields }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialValues) {
            const formattedValues = { ...initialValues };
            if (initialValues.date) {
                formattedValues.date = moment(initialValues.date);
            }
            form.setFieldsValue(formattedValues);
        } else {
            form.resetFields();
        }
    }, [initialValues, form]);

    const handleSubmit = (values) => {
        if (values.date) {
            values.date = values.date.format("YYYY-MM-DD");
        }
        onSubmit(values);
    };

    return (
        <Modal
            title={formType === "edit" ? "Chỉnh sửa" : "Thêm mới"}
            visible={visible}
            onOk={() => form.submit()}
            onCancel={onCancel}
            okText="Lưu"
            cancelText="Hủy"
        >
            <Form form={form} onFinish={handleSubmit} layout="vertical">
                {fields.map((field) => {
                    if (field.type === "select") {
                        return (
                            <Form.Item
                                key={field.name}
                                name={field.name}
                                label={field.label}
                                rules={[{ required: true, message: `Vui lòng chọn ${field.label}!` }]}
                            >
                                <Select placeholder={`Chọn ${field.label}`}>
                                    {field.options.map((option) => (
                                        <Option key={option.value} value={option.value}>
                                            {option.label}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        );
                    } else if (field.type === "date") {
                        return (
                            <Form.Item
                                key={field.name}
                                name={field.name}
                                label={field.label}
                                rules={[{ required: true, message: `Vui lòng nhập ${field.label}!` }]}
                            >
                                <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                            </Form.Item>
                        );
                    } else {
                        return (
                            <Form.Item
                                key={field.name}
                                name={field.name}
                                label={field.label}
                                rules={[{ required: true, message: `Vui lòng nhập ${field.label}!` }]}
                            >
                                <Input placeholder={`Nhập ${field.label}`} disabled={field.disabled} />
                            </Form.Item>
                        );
                    }
                })}
            </Form>
        </Modal>
    );
};

export default CrudForm;