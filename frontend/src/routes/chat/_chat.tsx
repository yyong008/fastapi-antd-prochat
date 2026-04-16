import { Outlet, createFileRoute } from "@tanstack/react-router";

import { Select, Typography } from "antd";
import { useTheme } from "antd-style";

import { chatWorkspaceInnerClass } from "../_sharedUi";

export const Route = createFileRoute("/chat/_chat")({
  component: ChatLayoutRoute,
});

function ChatLayoutRoute() {
  const theme = useTheme();

  return (
    <div className={`${chatWorkspaceInnerClass} gap-3`}>
      <div
        className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b pb-3 sm:justify-end"
        style={{ borderColor: theme.colorBorderSecondary }}
      >
        <Typography.Text type="secondary" className="text-sm">
          模型
        </Typography.Text>
        <Select
          className="min-w-[min(100%,200px)]"
          defaultValue="glm-4-flash"
          onChange={() => {}}
          options={[{ value: "glm-4-flash", label: "glm-4-flash" }]}
          popupMatchSelectWidth={false}
        />
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
