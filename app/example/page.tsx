"use client";

import { Button, Card, Input, List, Space, Spin, message } from "antd";
import { DeleteOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { apiGet, apiPost, apiDelete } from "@/lib/api";

interface Item {
    id: string;
    name: string;
    description?: string;
}

export default function ExamplePage() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const [newItemName, setNewItemName] = useState("");

    // Fetch items example
    const fetchItems = async () => {
        setLoading(true);
        const response = await apiGet<Item[]>("/items");
        if (response.success && response.data) {
            setItems(response.data);
            message.success("Items loaded successfully");
        } else {
            message.error(response.error || "Failed to load items");
        }
        setLoading(false);
    };

    // Create item example
    const handleAddItem = async () => {
        if (!newItemName.trim()) {
            message.warning("Please enter an item name");
            return;
        }

        const response = await apiPost<Item>("/items", {
            name: newItemName,
            description: `Created at ${new Date().toLocaleString()}`,
        });

        if (response.success && response.data) {
            setItems([...items, response.data]);
            setNewItemName("");
            message.success("Item added successfully");
        } else {
            message.error(response.error || "Failed to add item");
        }
    };

    // Delete item example
    const handleDeleteItem = async (id: string) => {
        const response = await apiDelete(`/items/${id}`);
        if (response.success) {
            setItems(items.filter((item) => item.id !== id));
            message.success("Item deleted successfully");
        } else {
            message.error(response.error || "Failed to delete item");
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
            <Card
                title="Ant Design + Next.js API Example"
                extra={
                    <Button
                        type="primary"
                        icon={<ReloadOutlined />}
                        onClick={fetchItems}
                        loading={loading}
                    >
                        Refresh
                    </Button>
                }
            >
                <Space.Compact style={{ marginBottom: "16px", width: "100%" }}>
                    <Input
                        placeholder="Enter item name"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        onPressEnter={handleAddItem}
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddItem}
                        loading={loading}
                    >
                        Add Item
                    </Button>
                </Space.Compact>

                <Spin spinning={loading}>
                    <List
                        dataSource={items}
                        renderItem={(item) => (
                            <List.Item
                                actions={[
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleDeleteItem(item.id)}
                                    />,
                                ]}
                            >
                                <List.Item.Meta
                                    title={item.name}
                                    description={item.description}
                                />
                            </List.Item>
                        )}
                        locale={{ emptyText: "No items yet" }}
                    />
                </Spin>
            </Card>
        </div>
    );
}
