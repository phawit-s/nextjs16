# Ant Design Setup & API Fetch Template

## Installation

Ant Design and related packages have been added to your project:

```bash
npm install antd @ant-design/icons
```

## Structure

### Files Created

- `lib/api.ts` - Reusable API fetch utility
- `app/providers.tsx` - Ant Design ConfigProvider wrapper
- `app/example/page.tsx` - Example usage of Ant Design + API template
- `.env.example` - Environment configuration template

## Configuration

### 1. Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Change the URL to match your API server.

### 2. Ant Design Available Components

Common Ant Design components you can import from `antd`:

```typescript
import {
  Button,
  Input,
  Form,
  Modal,
  Table,
  Card,
  List,
  Message,
  Notification,
  Spin,
  Select,
  DatePicker,
  Checkbox,
  Radio,
  Switch,
  Tag,
  Badge,
  Avatar,
  Menu,
  Breadcrumb,
  Pagination,
  Tabs,
  Drawer,
  Popover,
  Tooltip,
} from "antd";
```

### 3. Ant Design Icons

```typescript
import {
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  SearchOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
```

## API Fetch Template Usage

### Basic GET Request

```typescript
import { apiGet } from "@/lib/api";

const response = await apiGet("/users");
if (response.success) {
  console.log(response.data);
} else {
  console.error(response.error);
}
```

### POST Request with Body

```typescript
import { apiPost } from "@/lib/api";

const response = await apiPost("/users", {
  name: "John",
  email: "john@example.com",
});

if (response.success) {
  console.log("User created:", response.data);
}
```

### GET Request with Query Params

```typescript
const response = await apiGet("/users", {
  params: {
    page: 1,
    limit: 10,
    search: "john",
  },
});
```

### Custom Headers

```typescript
const response = await apiGet("/protected-endpoint", {
  headers: {
    Authorization: "Bearer YOUR_TOKEN",
    "X-Custom-Header": "value",
  },
});
```

### Custom Timeout

```typescript
const response = await apiGet("/slow-endpoint", {
  timeout: 60000, // 60 seconds (default is 30 seconds)
});
```

### All Available Methods

```typescript
import {
  apiRequest, // Generic request with full control
  apiGet,     // GET request
  apiPost,    // POST request
  apiPut,     // PUT request
  apiPatch,   // PATCH request
  apiDelete,  // DELETE request
} from "@/lib/api";
```

## Complete Example

See `app/example/page.tsx` for a full working example that includes:

- Fetching data from an API
- Creating new items
- Deleting items
- Loading states
- Error handling
- Toast messages

Visit `/example` route to see it in action.

## Response Type

All API methods return an `ApiResponse<T>` object:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T; // The response data (if successful)
  error?: string; // Error message (if failed)
  code?: number; // HTTP status code
}
```

## Error Handling

```typescript
const response = await apiPost("/users", userData);

if (response.success) {
  // Handle success
  console.log(response.data);
} else {
  // Handle error
  console.error(`Error (${response.code}):`, response.error);
}
```

## Integration with Ant Design Forms

```typescript
"use client";

import { Form, Button, Input, message } from "antd";
import { apiPost } from "@/lib/api";

export default function MyForm() {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const response = await apiPost("/submit", values);
    if (response.success) {
      message.success("Form submitted successfully");
      form.resetFields();
    } else {
      message.error(response.error || "Failed to submit");
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: "Please enter username" }]}
      >
        <Input placeholder="Enter username" />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form>
  );
}
```

## Tips

1. Always wrap components using Ant Design Modal, Drawer, or Context in `"use client"` directive
2. Use CSS modules or styled-components with Ant Design for custom styling
3. Customize theme by passing a `theme` prop to ConfigProvider in `app/providers.tsx`
4. Remember to handle loading states and errors in your components

## Customizing Ant Design Theme

Edit `app/providers.tsx` to customize the theme:

```typescript
"use client";

import { ConfigProvider } from "antd";
import React from "react";

export function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1890ff",
          borderRadius: 4,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
```
