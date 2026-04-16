import { Button, FloatButton, Upload, message, Typography } from "antd";
import { CheckCard, ProCard } from "@ant-design/pro-components";
import { FileTextOutlined, HomeOutlined, UploadOutlined } from "@ant-design/icons";
import { Link, createFileRoute, useParams } from "@tanstack/react-router";
import { addFileToKnowledge, getKnowledgeById } from "../../apis/knowledge";
import { useEffect, useState } from "react";
import { useTheme } from "antd-style";

export const Route = createFileRoute("/knowledge/$id")({
  component: RoutComponent,
});

function RoutComponent() {
  const theme = useTheme();
  const { id } = useParams({ from: "/knowledge/$id" });
  const [selectFile, setSelectFile] = useState("");
  const [data, setData] = useState({
    info: {
      name: "",
      description: "",
    },
    files: [] as { id: string; meta?: { name?: string }; data?: { content?: string } }[],
  });

  const getData = async () => {
    const res = await getKnowledgeById(id);
    setData((pd) => ({
      ...pd,
      ...res,
    }));
  };

  useEffect(() => {
    getData();
  }, [id]);

  return (
    <div
      className="min-h-dvh w-full pb-24"
      style={{
        background: theme.colorBgLayout,
        color: theme.colorText,
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link to="/knowledge" className="mb-2 inline-block">
              <Button type="link" className="px-0">
                ← 返回列表
              </Button>
            </Link>
            <Typography.Title level={2} className="!mb-1">
              {data.info.name || "知识库"}
            </Typography.Title>
            <Typography.Text type="secondary" className="text-sm">
              {data.info.description}
            </Typography.Text>
          </div>
          <Link to="/">
            <Button type="default">首页</Button>
          </Link>
        </div>

        <UploadFileContent id={id} getData={getData} />

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
          <FileList files={data.files} selectFile={selectFile} setSelectFile={setSelectFile} />
          <FileContent files={data.files} selectFile={selectFile} />
        </div>
      </div>

      <Link to="/" className="fixed bottom-6 right-6 z-10">
        <FloatButton type="primary" icon={<HomeOutlined />} tooltip="首页" />
      </Link>
    </div>
  );
}

function UploadFileContent({ id, getData }: { id: string; getData: () => void }) {
  const handleUploadChange = async (info: Parameters<NonNullable<Upload["props"]["onChange"]>>[0]) => {
    const { status } = info.file;

    if (status === "uploading") {
      return;
    }

    if (status === "done") {
      const response = info.file.response as { id?: string } | undefined;
      message.success(`${info.file.name} 上传成功`);
      if (response?.id) {
        await addFileToKnowledge(id, { id: response.id });
        getData();
      } else {
        message.error("服务器未返回文件 id");
      }
    } else if (status === "error") {
      message.error(`${info.file.name} 上传失败`);
    }
  };

  return (
    <Upload
      name="file"
      action="/api/upload/file"
      accept=".pdf,.txt,.md,.csv"
      maxCount={1}
      showUploadList={{ showRemoveIcon: true }}
      onChange={handleUploadChange}
    >
      <Button icon={<UploadOutlined />}>上传文件</Button>
    </Upload>
  );
}

function FileList({
  files,
  selectFile,
  setSelectFile,
}: {
  files: { id: string; meta?: { name?: string } }[];
  selectFile: string;
  setSelectFile: (id: string) => void;
}) {
  const theme = useTheme();

  if (!files?.length) {
    return (
      <div
        className="rounded-lg border border-dashed px-4 py-8 text-center text-sm lg:w-80 lg:shrink-0"
        style={{ borderColor: theme.colorBorderSecondary, color: theme.colorTextSecondary }}
      >
        暂无文件，请先上传
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl lg:w-80 lg:shrink-0">
      <Typography.Title level={5} className="!mt-0">
        文件列表
      </Typography.Title>
      <CheckCard.Group
        onChange={(v) => {
          if (typeof v === "string") setSelectFile(v);
        }}
        value={selectFile}
        className="w-full"
      >
        {files?.map((file) => (
          <CheckCard
            key={file.id}
            value={file.id}
            title={file.meta?.name ?? file.id}
            description={
              <div className="flex items-center gap-2">
                <FileTextOutlined />
                <span className="line-clamp-1">{file.meta?.name}</span>
              </div>
            }
          />
        ))}
      </CheckCard.Group>
    </div>
  );
}

function FileContent({
  selectFile,
  files,
}: {
  selectFile: string;
  files: { id: string; data?: { content?: string } }[];
}) {
  const theme = useTheme();
  const content = files?.find((file) => file.id === selectFile)?.data?.content;

  return (
    <ProCard
      className="min-h-[280px] flex-1 shadow-sm"
      style={{ background: theme.colorBgContainer }}
    >
      {!selectFile ? (
        <Typography.Text type="secondary">请选择左侧文件查看内容</Typography.Text>
      ) : (
        <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed">{content}</pre>
      )}
    </ProCard>
  );
}
