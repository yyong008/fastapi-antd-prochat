import { Button, Card, Input, Select, Space, message } from "antd";
import { Link, createFileRoute } from "@tanstack/react-router";

import { ArrowLeftOutlined } from "@ant-design/icons";
import { createTranslate } from "../../apis/transalte";
import { useState } from "react";
import { useTheme } from "antd-style";

export const Route = createFileRoute("/translate/")({
  component: RouteComponent,
});

const options = [
  { label: "中文", value: "Chinese" },
  { label: "英文", value: "English" },
  { label: "日语", value: "Japanese" },
  { label: "韩语", value: "Korean" },
  { label: "法语", value: "French" },
  { label: "德语", value: "German" },
  { label: "西班牙语", value: "Spanish" },
  { label: "葡萄牙语", value: "Portuguese" },
  { label: "俄语", value: "Russian" },
  { label: "阿拉伯语", value: "Arabic" },
  { label: "泰语", value: "Thai" },
  { label: "越南语", value: "Vietnamese" },
];

function RouteComponent() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    lang_from: "",
    lang_to: "",
    content: "",
    content_t: "",
  });

  return (
    <div
      className="min-h-dvh w-full"
      style={{
        background: theme.colorBgLayout,
        color: theme.colorText,
      }}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6">
        <div className="flex items-center gap-3">
          <Link to="/">
            <Button type="text" icon={<ArrowLeftOutlined />}>
              返回首页
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">AI 翻译</h1>
          <p className="mt-1 text-sm" style={{ color: theme.colorTextSecondary }}>
            选择源语言与目标语言，输入原文后点击翻译。
          </p>
        </div>

        <Card styles={{ body: { padding: 20 } }}>
          <Space direction="vertical" size="middle" className="w-full">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Select
                className="min-w-[min(100%,200px)] sm:w-48"
                options={options}
                placeholder="源语言"
                onChange={(value) => {
                  setData((prev) => ({ ...prev, lang_from: value }));
                }}
              />
              <Select
                className="min-w-[min(100%,200px)] sm:w-48"
                options={options}
                placeholder="目标语言"
                onChange={(value) => {
                  setData((prev) => ({ ...prev, lang_to: value }));
                }}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="flex min-h-[220px] flex-col gap-2">
                <span className="text-xs font-medium" style={{ color: theme.colorTextSecondary }}>
                  原文
                </span>
                <Input.TextArea
                  className="min-h-[200px] flex-1 font-sans text-base leading-relaxed"
                  placeholder="在此输入要翻译的文本"
                  value={data.content}
                  onChange={(e) => {
                    setData((prev) => ({ ...prev, content: e.target.value }));
                  }}
                />
              </div>
              <div className="flex min-h-[220px] flex-col gap-2">
                <span className="text-xs font-medium" style={{ color: theme.colorTextSecondary }}>
                  译文
                </span>
                <Input.TextArea
                  readOnly
                  className="min-h-[200px] flex-1 font-sans text-base leading-relaxed"
                  style={{ background: theme.colorFillTertiary }}
                  placeholder="译文将显示在这里"
                  value={data.content_t}
                />
              </div>
            </div>

            <Button
              type="primary"
              loading={loading}
              onClick={async () => {
                if (!data.lang_from || !data.lang_to || !data.content) {
                  message.error("请填写完整");
                  return;
                }
                setLoading(true);
                const res: { code?: number; data?: string; message?: string } = await createTranslate(data);
                setLoading(false);
                if (res && res.code === 0) {
                  setData((prev) => ({ ...prev, content_t: res.data ?? "" }));
                  return;
                }
                message.error(res?.message ?? "翻译失败");
              }}
            >
              翻译
            </Button>
          </Space>
        </Card>
      </div>
    </div>
  );
}
