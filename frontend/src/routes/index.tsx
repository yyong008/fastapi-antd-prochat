import { Link, createFileRoute } from "@tanstack/react-router";
import type { CSSProperties, ReactNode } from "react";

import {
  ArrowRightOutlined,
  BookOutlined,
  CloudServerOutlined,
  MessageOutlined,
  RobotOutlined,
  ThunderboltOutlined,
  TranslationOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { useTheme } from "antd-style";

import { APP_MODULES } from "../config/navigation";

export const Route = createFileRoute("/")({
  component: HomeRoute,
});

type Feature = {
  to: string;
  title: string;
  description: string;
  icon: ReactNode;
  accent: string;
};

const FEATURE_META: Record<
  "chat" | "langchain" | "ollama" | "translate" | "knowledge",
  { description: string; accent: string; icon: ReactNode }
> = {
  chat: {
    description: "与主流大模型多轮对话，上下文连贯、响应流式输出。",
    accent: "#1677ff",
    icon: <MessageOutlined />,
  },
  langchain: {
    description: "链式编排与工具调用，适合复杂任务与自动化流程。",
    accent: "#722ed1",
    icon: <RobotOutlined />,
  },
  ollama: {
    description: "对接本机模型，数据不出域，低延迟与离线可用。",
    accent: "#389e0d",
    icon: <CloudServerOutlined />,
  },
  translate: {
    description: "多语种互译，贴合语境的表述建议。",
    accent: "#d46b08",
    icon: <TranslationOutlined />,
  },
  knowledge: {
    description: "文档入库与检索增强，支撑 RAG 问答。",
    accent: "#cf1322",
    icon: <BookOutlined />,
  },
};

const FEATURES: Feature[] = APP_MODULES.map((m) => ({
  to: m.to,
  title: m.label,
  ...FEATURE_META[m.key],
}));

const TECH_PILLS = ["FastAPI", "Ant Design", "React 19", "TanStack Router", "Tailwind CSS 4"];

function HomeRoute() {
  const theme = useTheme();
  const [heroModule, ...gridModules] = FEATURES;

  const gridLine = `${theme.colorBorderSecondary}1a`;
  const meshBg = `
    radial-gradient(ellipse 100% 80% at 50% -30%, ${theme.colorPrimary}24, transparent 55%),
    radial-gradient(ellipse 60% 50% at 100% 0%, ${theme.colorInfo}18, transparent 45%),
    radial-gradient(ellipse 50% 45% at 0% 20%, ${theme.colorSuccess}10, transparent 50%),
    linear-gradient(to bottom, ${theme.colorBgLayout}, ${theme.colorBgLayout})
  `;

  const gridPattern: CSSProperties = {
    backgroundImage: `
      linear-gradient(to right, ${gridLine} 1px, transparent 1px),
      linear-gradient(to bottom, ${gridLine} 1px, transparent 1px)
    `,
    backgroundSize: "56px 56px",
    maskImage: "radial-gradient(ellipse 75% 65% at 50% 40%, black 20%, transparent 100%)",
    WebkitMaskImage:
      "radial-gradient(ellipse 75% 65% at 50% 40%, black 20%, transparent 100%)",
  };

  const gradientTitle: CSSProperties = {
    background: `linear-gradient(135deg, ${theme.colorPrimary} 0%, ${theme.colorInfo} 55%, ${theme.colorSuccess} 110%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  return (
    <div
      className="relative flex min-h-dvh flex-col font-sans antialiased"
      style={{ background: theme.colorBgLayout, color: theme.colorText }}
    >
      <HomeTopNav />

      <div className="relative min-h-0 flex-1" style={{ color: theme.colorText }}>
        {/* 背景 */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0" style={{ background: meshBg }} />
          <div className="absolute inset-0 opacity-[0.65]" style={gridPattern} />
          <div
            className="absolute -left-[20%] top-1/4 h-[420px] w-[420px] rounded-full blur-3xl"
            style={{ background: `${theme.colorPrimary}12` }}
          />
          <div
            className="absolute -right-[15%] bottom-0 h-[360px] w-[360px] rounded-full blur-3xl"
            style={{ background: `${theme.colorInfo}10` }}
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-20 pt-12 sm:px-8 sm:pt-16">
          {/* Hero */}
          <header className="text-center">
            <div
              className="mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[13px] font-medium shadow-sm backdrop-blur-sm"
              style={{
                borderColor: theme.colorBorderSecondary,
                background: `${theme.colorBgContainer}b3`,
                color: theme.colorTextSecondary,
              }}
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: theme.colorSuccess, boxShadow: `0 0 10px ${theme.colorSuccess}` }}
              />
              生产级 AI 对话工作台 · v2
            </div>

            <h1 className="mx-auto w-full max-w-3xl text-center text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl md:leading-[1.05]">
              <span className="block" style={{ color: theme.colorText }}>
                构建你的
              </span>
              <span
                className="mt-1 block sm:mt-1.5"
                style={{
                  ...gradientTitle,
                  textAlign: "center",
                  display: "block",
                }}
              >
                智能对话体验
              </span>
            </h1>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:mt-12 sm:flex-row sm:gap-4">
              <Link to="/chat">
                <Button
                  type="primary"
                  size="large"
                  shape="round"
                  icon={<MessageOutlined />}
                  className="h-12! px-8! text-base! font-semibold! shadow-lg"
                >
                  进入 AI 对话
                </Button>
              </Link>
              <Link to="/ollama">
                <Button size="large" shape="round" className="h-12! px-8! text-base!">
                  使用本地 Ollama
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              {TECH_PILLS.map((label) => (
                <span
                  key={label}
                  className="rounded-lg border px-3 py-1 text-xs font-medium"
                  style={{
                    borderColor: theme.colorBorderSecondary,
                    color: theme.colorTextTertiary ?? theme.colorTextSecondary,
                    background: theme.colorBgContainer,
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </header>

          {/* 主模块 + 栅格 */}
          <section className="mt-20 sm:mt-24">
            <div className="mb-8 flex flex-col items-center gap-1 text-center sm:mb-10">
              <span
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: theme.colorTextTertiary ?? theme.colorTextSecondary }}
              >
                Modules
              </span>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">选择工作区</h2>
              <p
                className="mx-auto max-w-lg text-sm sm:text-base"
                style={{ color: theme.colorTextSecondary }}
              >
                以下为常用能力入口，与顶部导航一致。
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <FeaturedModuleCard feature={heroModule} />

              <ul className="grid list-none grid-cols-1 gap-4 sm:grid-cols-2">
                {gridModules.map((f) => (
                  <li key={f.to}>
                    <ModuleTile feature={f} />
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <footer
            className="mt-20 flex flex-col items-center gap-3 border-t pt-10 text-center sm:mt-24"
            style={{
              borderColor: theme.colorBorderSecondary,
              color: theme.colorTextTertiary ?? theme.colorTextSecondary,
            }}
          >
            <div
              className="flex items-center justify-center gap-2 text-sm font-semibold"
              style={{ color: theme.colorText }}
            >
              <span
                className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white"
                style={{
                  background: `linear-gradient(145deg, ${theme.colorPrimary}, ${theme.colorPrimaryActive})`,
                }}
              >
                F
              </span>
              FastAPI ProChat
            </div>
            <p className="max-w-md text-xs leading-relaxed sm:text-sm">
              开源示例项目：前后端分离、可替换模型与扩展中间件。祝开发愉快。
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

function HomeTopNav() {
  const theme = useTheme();

  return (
    <header
      className="sticky top-0 z-30 shrink-0 border-b backdrop-blur-md"
      style={{
        borderColor: theme.colorBorderSecondary,
        backgroundColor: `${theme.colorBgContainer}e8`,
      }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <Link to="/" className="flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm"
            style={{
              background: `linear-gradient(145deg, ${theme.colorPrimary}, ${theme.colorPrimaryActive})`,
            }}
          >
            F
          </span>
          <span className="truncate text-[15px] font-bold tracking-tight">FastAPI ProChat</span>
        </Link>

        <nav
          className="flex min-w-0 flex-1 items-center justify-center gap-0 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-0.5 [&::-webkit-scrollbar]:hidden"
          aria-label="模块导航"
        >
          {APP_MODULES.map((m) => (
            <Link key={m.to} to={m.to} className="shrink-0">
              <Button type="text" size="small" style={{ color: theme.colorTextSecondary }}>
                {m.shortLabel}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="shrink-0">
          <Link to="/chat">
            <Button type="primary" size="small" icon={<ThunderboltOutlined />} className="font-semibold!">
              开始对话
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

function FeaturedModuleCard({ feature }: { feature: Feature }) {
  const theme = useTheme();

  return (
    <Link to={feature.to} className="group block outline-none">
      <article
        className="relative overflow-hidden rounded-3xl border transition-all duration-300 hover:shadow-xl"
        style={{
          borderColor: theme.colorBorderSecondary,
          background: `linear-gradient(135deg, ${theme.colorBgContainer} 0%, ${theme.colorPrimaryBg} 35%, ${theme.colorBgContainer} 100%)`,
          boxShadow: theme.boxShadowSecondary,
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-px opacity-80"
          style={{
            background: `linear-gradient(90deg, transparent, ${feature.accent}, transparent)`,
          }}
        />
        <div className="flex flex-col gap-8 p-8 md:flex-row md:items-center md:justify-between md:p-10">
          <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center md:gap-8">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl text-white shadow-lg transition-transform duration-300 group-hover:scale-[1.04]"
              style={{
                background: `linear-gradient(145deg, ${feature.accent}, ${feature.accent}99)`,
                boxShadow: `0 12px 40px -12px ${feature.accent}66`,
              }}
            >
              {feature.icon}
            </div>
            <div className="min-w-0 text-left">
              <p
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: theme.colorPrimary }}
              >
                推荐
              </p>
              <h3 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">{feature.title}</h3>
              <p className="mt-2 max-w-xl text-base leading-relaxed" style={{ color: theme.colorTextSecondary }}>
                {feature.description}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 md:pl-4">
            <span
              className="inline-flex h-12 items-center gap-2 rounded-full border px-6 text-sm font-semibold transition-all duration-300 group-hover:gap-3"
              style={{
                borderColor: theme.colorPrimary,
                color: theme.colorPrimary,
                background: theme.colorBgContainer,
              }}
            >
              打开工作区
              <ArrowRightOutlined className="text-xs" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function ModuleTile({ feature }: { feature: Feature }) {
  const theme = useTheme();

  return (
    <Link to={feature.to} className="group block h-full min-h-[200px] outline-none">
      <article
        className="flex h-full flex-col rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-lg"
        style={{
          borderColor: theme.colorBorderSecondary,
          backgroundColor: theme.colorBgContainer,
          boxShadow: theme.boxShadowTertiary,
        }}
      >
        <div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-lg text-white shadow-md transition-transform duration-300 group-hover:scale-105"
          style={{
            background: `linear-gradient(145deg, ${feature.accent}, ${feature.accent}bb)`,
          }}
        >
          {feature.icon}
        </div>
        <h3 className="text-lg font-bold tracking-tight">{feature.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed" style={{ color: theme.colorTextSecondary }}>
          {feature.description}
        </p>
        <div
          className="mt-5 flex items-center gap-1 text-sm font-semibold transition-[gap] duration-300 group-hover:gap-2"
          style={{ color: theme.colorPrimary }}
        >
          进入
          <ArrowRightOutlined className="text-[10px] opacity-80" />
        </div>
      </article>
    </Link>
  );
}
