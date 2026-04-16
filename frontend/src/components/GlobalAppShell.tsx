import type { ReactNode } from "react";

import {
  AppstoreOutlined,
  BookOutlined,
  CloudServerOutlined,
  MessageOutlined,
  RobotOutlined,
  ThunderboltOutlined,
  TranslationOutlined,
} from "@ant-design/icons";
import { Button, Layout } from "antd";
import { Link, useRouterState } from "@tanstack/react-router";
import { useTheme } from "antd-style";

import { APP_MODULES, OVERVIEW, isRouteActive } from "../config/navigation";

const { Sider, Content } = Layout;

const MODULE_ICONS: Record<string, ReactNode> = {
  chat: <MessageOutlined />,
  langchain: <RobotOutlined />,
  ollama: <CloudServerOutlined />,
  translate: <TranslationOutlined />,
  knowledge: <BookOutlined />,
};

type GlobalAppShellProps = {
  children: ReactNode;
};

export function GlobalAppShell({ children }: GlobalAppShellProps) {
  const theme = useTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <Layout className="min-h-dvh" hasSider>
      <Sider
        width={248}
        className="overflow-y-auto shadow-[4px_0_24px_-12px_rgba(0,0,0,0.08)]"
        style={{
          borderRight: `1px solid ${theme.colorBorderSecondary}`,
          background: theme.colorBgContainer,
        }}
      >
        <div className="flex h-full min-h-dvh flex-col px-3 pb-5 pt-6">
          <Link
            to="/"
            className="mb-8 flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors"
            style={{ backgroundColor: "transparent" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colorFillSecondary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-md ring-2"
              style={{
                background: `linear-gradient(145deg, ${theme.colorPrimary}, ${theme.colorPrimaryActive})`,
                boxShadow: `0 0 0 2px ${theme.colorBorderSecondary}`,
              }}
            >
              F
            </span>
            <div className="min-w-0">
              <div className="truncate text-[15px] font-bold leading-tight tracking-tight">
                FastAPI ProChat
              </div>
              <div className="truncate text-xs font-medium" style={{ color: theme.colorTextSecondary }}>
                AI 对话平台
              </div>
            </div>
          </Link>

          <div
            className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: theme.colorTextTertiary ?? theme.colorTextSecondary }}
          >
            平台
          </div>
          <nav className="flex flex-col gap-0.5" aria-label="应用导航">
            <SideLink
              to={OVERVIEW.to}
              icon={<AppstoreOutlined />}
              label={OVERVIEW.label}
              active={isRouteActive(pathname, OVERVIEW.to)}
            />
          </nav>

          <div
            className="mb-2 mt-6 px-2 text-[11px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: theme.colorTextTertiary ?? theme.colorTextSecondary }}
          >
            模块
          </div>
          <nav className="flex flex-1 flex-col gap-0.5" aria-label="功能模块">
            {APP_MODULES.map((m) => (
              <SideLink
                key={m.key}
                to={m.to}
                icon={MODULE_ICONS[m.key] ?? <MessageOutlined />}
                label={m.label}
                active={isRouteActive(pathname, m.to)}
              />
            ))}
          </nav>

          <div
            className="mt-4 border-t pt-5"
            style={{ borderColor: theme.colorBorderSecondary }}
          >
            <Link to="/chat" className="block">
              <Button type="primary" block shape="round" icon={<ThunderboltOutlined />} size="large" className="font-semibold!">
                开始对话
              </Button>
            </Link>
          </div>
        </div>
      </Sider>

      <Layout>
        <Content
          className="relative min-h-dvh"
          style={{
            background: theme.colorBgLayout,
            margin: 0,
            overflow: "auto",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

function SideLink({
  to,
  icon,
  label,
  active,
}: {
  to: string;
  icon: ReactNode;
  label: string;
  active: boolean;
}) {
  const theme = useTheme();

  return (
    <Link to={to} className="block outline-none">
      <div
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200"
        style={{
          background: active ? theme.colorPrimaryBg : "transparent",
          color: active ? theme.colorPrimary : theme.colorText,
          fontWeight: active ? 600 : 500,
          boxShadow: active ? `inset 0 0 0 1px ${theme.colorPrimary}22` : "none",
        }}
        onMouseEnter={(e) => {
          if (!active) e.currentTarget.style.background = theme.colorFillSecondary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = active ? theme.colorPrimaryBg : "transparent";
        }}
      >
        <span className={`text-[17px] ${active ? "" : "opacity-85"}`}>{icon}</span>
        <span className="truncate">{label}</span>
      </div>
    </Link>
  );
}
