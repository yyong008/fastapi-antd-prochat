import { Button, Card, FloatButton, Form, Input, Modal, Spin, Tooltip, Typography } from "antd";
import { EditFilled, HomeOutlined, MoreOutlined } from "@ant-design/icons";
import { Link, createFileRoute } from "@tanstack/react-router";
import { createKnowledge, deleteKnowledge, getKnowledges } from "../../apis/knowledge";

import { useEffect } from "react";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";
import { useTheme } from "antd-style";

export const Route = createFileRoute("/knowledge/")({
  component: RouteCm,
});

function RouteCm() {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    try {
      const result: unknown = await getKnowledges();
      const list = Array.isArray(result)
        ? result
        : (result as { data?: unknown } | null | undefined)?.data;
      setData(Array.isArray(list) ? list : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div
      className="min-h-dvh w-full"
      style={{
        background: theme.colorBgLayout,
        color: theme.colorText,
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <Typography.Title level={2} className="!mb-1">
              知识库
            </Typography.Title>
            <Typography.Text type="secondary">创建并管理文档集合，用于 RAG 检索。</Typography.Text>
          </div>
          <Link to="/">
            <Button type="default">返回首页</Button>
          </Link>
        </div>

        <CreateKnowledgeModal getData={getData} />

        <Spin spinning={loading}>
          <KnowledgeList list={data || []} getData={getData} />
        </Spin>
      </div>

      <Link to="/" className="fixed bottom-6 right-6 z-10">
        <FloatButton type="primary" icon={<HomeOutlined />} tooltip="首页" />
      </Link>
    </div>
  );
}

function CreateKnowledgeModal({ getData }: { getData: () => void }) {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const createKnowledgeHandler = async () => {
    const data = {
      name: form.getFieldValue("name"),
      description: form.getFieldValue("description"),
    };
    await createKnowledge(data);
    setVisible(false);
    form.resetFields();
    getData();
  };

  return (
    <div className="mb-6">
      <Button type="primary" icon={<EditFilled />} onClick={() => setVisible(true)}>
        创建知识库
      </Button>
      <Modal
        title="创建知识库"
        open={visible}
        okText="创建"
        cancelText="取消"
        onOk={createKnowledgeHandler}
        onCancel={() => setVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item label="名称" name="name" rules={[{ required: true, message: "请输入名称" }]}>
            <Input placeholder="知识库名称" />
          </Form.Item>
          <Form.Item
            label="描述"
            name="description"
            rules={[{ required: true, message: "请输入描述" }]}
          >
            <Input.TextArea rows={3} placeholder="简要描述用途" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

function KnowledgeList({ list, getData }: { list: { id: string; name?: string; description?: string }[]; getData: () => void }) {
  const theme = useTheme();

  if (!list?.length) {
    return (
      <div
        className="rounded-lg border border-dashed px-6 py-16 text-center text-sm"
        style={{
          borderColor: theme.colorBorderSecondary,
          color: theme.colorTextSecondary,
        }}
      >
        暂无知识库，点击上方「创建知识库」开始
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((item) => (
        <KnowledgeCard key={item.id} item={item} getData={getData} />
      ))}
    </div>
  );
}

function KnowledgeCard({
  item,
  getData,
}: {
  item: { id: string; name?: string; description?: string };
  getData: () => void;
}) {
  const theme = useTheme();

  return (
    <Card
      title={<span className="font-medium">知识库</span>}
      className="h-full shadow-sm"
      styles={{ body: { minHeight: 100 } }}
      extra={<TooltipDelete id={item.id} getData={getData} />}
    >
      <Link to={`/knowledge/${item.id}`} className="block outline-none">
        <div className="text-lg font-semibold" style={{ color: theme.colorText }}>
          {item.name}
        </div>
        <div className="mt-2 line-clamp-3 text-sm" style={{ color: theme.colorTextSecondary }}>
          {item.description}
        </div>
      </Link>
    </Card>
  );
}

function TooltipDelete({ id, getData }: { id: string; getData: () => void }) {
  const deleteKnowledgeHandler = async () => {
    await deleteKnowledge(id);
    getData();
  };

  return (
    <Tooltip title="删除">
      <MoreOutlined className="cursor-pointer text-base" onClick={deleteKnowledgeHandler} />
    </Tooltip>
  );
}
