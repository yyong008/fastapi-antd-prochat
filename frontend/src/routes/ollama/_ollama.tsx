import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useContext, useEffect, useState } from "react";

import { Select, Typography } from "antd";
import { useTheme } from "antd-style";
import { getOllamaModels } from "../../apis/ollama";
import { ollamaContext } from "../../context";

import { chatWorkspaceInnerClass } from "../_sharedUi";

export const Route = createFileRoute("/ollama/_ollama")({
  component: ChatLayoutRoute,
});

function ChatLayoutRoute() {
  const theme = useTheme();
  const [modelName, setModelName] = useState("");
  const [data, setData] = useState<{ name: string }[]>([]);

  const getModelList = async () => {
    const res: { models?: { name: string }[] } = await getOllamaModels();
    setData(res?.models ?? []);
  };

  useEffect(() => {
    getModelList();
  }, []);

  const options =
    data?.map((item) => ({
      value: item.name,
      label: item.name,
    })) ?? [];

  return (
    <ollamaContext.Provider value={{ model_name: modelName }}>
      <div className={`${chatWorkspaceInnerClass} gap-3`}>
        <div
          className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b pb-3 sm:justify-end"
          style={{ borderColor: theme.colorBorderSecondary }}
        >
          <Typography.Text type="secondary" className="text-sm">
            Ollama 模型
          </Typography.Text>
          <Select
            allowClear
            placeholder={options.length ? "选择模型" : "暂无模型，请先启动 Ollama"}
            className="min-w-[min(100%,220px)]"
            onChange={(mn) => setModelName(mn ?? "")}
            options={options}
            notFoundContent={options.length ? undefined : "无可用模型"}
            popupMatchSelectWidth={false}
          />
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <Outlet />
        </div>
      </div>
    </ollamaContext.Provider>
  );
}
