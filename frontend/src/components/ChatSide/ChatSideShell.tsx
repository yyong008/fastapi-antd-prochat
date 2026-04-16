import { EditOutlined, HomeOutlined, MenuOutlined } from "@ant-design/icons";
import { Input, Modal, Popover, Spin, message } from "antd";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { deleteChatById, updateTitleById } from "../../apis/chat";
import { useContext, useEffect, useState, type ReactNode } from "react";
import { useTheme } from "antd-style";

import { chatContext } from "../../context/index";

export type ChatSideVariant = "chat" | "langchain" | "ollama";

const VARIANT: Record<
  ChatSideVariant,
  { sessionPath: (id: string) => string; listHome: `/${string}` }
> = {
  chat: { sessionPath: (id) => `/chat/${id}`, listHome: "/chat" },
  langchain: { sessionPath: (id) => `/langchain-chat/${id}`, listHome: "/langchain-chat" },
  ollama: { sessionPath: (id) => `/ollama/${id}`, listHome: "/ollama" },
};

export function ChatSideShell({
  variant,
  isLoading,
}: {
  variant: ChatSideVariant;
  isLoading: boolean;
}) {
  const theme = useTheme();
  const { chats } = useContext(chatContext) as { chats: unknown[] };
  const v = VARIANT[variant];

  return (
    <div
      className="flex h-full min-h-0 w-full flex-col gap-2 px-3 py-4"
      style={{ color: theme.colorText }}
    >
      <nav
        className="flex shrink-0 flex-col gap-0.5 border-b pb-3"
        style={{ borderColor: theme.colorBorderSecondary }}
      >
        <SideNavRow to="/" icon={<HomeOutlined style={{ opacity: 0.75 }} />}>
          主页
        </SideNavRow>
        <SideNavRow to="/chat" icon={<EditOutlined style={{ opacity: 0.75 }} />}>
          新建聊天
        </SideNavRow>
        <SideNavRow to="/langchain-chat" icon={<EditOutlined style={{ opacity: 0.75 }} />}>
          新建 LangChain
        </SideNavRow>
      </nav>

      <div
        className="flex shrink-0 items-center justify-between gap-2 px-1 pt-2 text-xs font-semibold uppercase tracking-wide"
        style={{ color: theme.colorTextTertiary ?? theme.colorTextSecondary }}
      >
        <span>聊天历史</span>
        <MenuOutlined style={{ opacity: 0.6 }} />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <Spin spinning={isLoading}>
          <ChatsList
            chats={(chats ?? []) as ChatItemShape[]}
            sessionPath={v.sessionPath}
            variant={variant}
          />
        </Spin>
      </div>
    </div>
  );
}

type ChatItemShape = { id: string; title: string; chat: string };

function SideNavRow({
  to,
  children,
  icon,
}: {
  to: string;
  children: ReactNode;
  icon: ReactNode;
}) {
  const theme = useTheme();

  return (
    <Link to={to} className="block outline-none">
      <div
        className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-sm transition-[background-color] duration-150"
        style={{ color: theme.colorText }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme.colorFillSecondary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <span className="truncate">{children}</span>
        {icon}
      </div>
    </Link>
  );
}

function ChatsList({
  chats,
  sessionPath,
  variant,
}: {
  chats: ChatItemShape[];
  sessionPath: (id: string) => string;
  variant: ChatSideVariant;
}) {
  const theme = useTheme();
  const p = useParams({ strict: false });
  const id = p["id"] as string | undefined;

  if (!chats?.length) {
    return (
      <p className="px-1 py-3 text-center text-xs" style={{ color: theme.colorTextTertiary }}>
        暂无会话
      </p>
    );
  }

  return (
    <ul className="m-0 list-none space-y-0.5 p-0">
      {chats.map((item) => {
        let title = "New Chat";
        try {
          if (item.title === title && item.chat) {
            const chat = JSON.parse(item.chat) as { content?: string }[];
            title = chat[0]?.content ?? title;
          } else {
            title = item.title;
          }
        } catch {
          title = item.title;
        }
        const active = id === item.id;

        return (
          <li key={item.id}>
            <Link to={sessionPath(item.id)} className="block outline-none">
              <Popover
                trigger="hover"
                placement="rightBottom"
                title={null}
                content={
                  <Content
                    id={item.id}
                    title={title}
                    item={item}
                    redirectAfterDelete={VARIANT[variant].listHome}
                  />
                }
              >
                <div
                  className="rounded-md px-2 py-2 text-xs leading-snug transition-[background-color,color] duration-150"
                  style={{
                    background: active ? theme.colorPrimaryBg : "transparent",
                    color: active ? theme.colorPrimary : theme.colorTextSecondary,
                    fontWeight: active ? 600 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = theme.colorFillSecondary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = active ? theme.colorPrimaryBg : "transparent";
                  }}
                >
                  {(title || item.title).slice(0, 50)}
                </div>
              </Popover>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function Content(props: {
  id: string;
  title: string;
  item: ChatItemShape;
  redirectAfterDelete: string;
}) {
  const [showTitle, setShowTitle] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div className="flex min-w-[120px] flex-col gap-2 text-sm">
      <div className="cursor-pointer py-0.5" onClick={() => setShowDelete(true)}>
        删除
      </div>
      <div className="cursor-pointer py-0.5" onClick={() => setShowTitle(true)}>
        修改标题
      </div>
      {showTitle && (
        <TitleModal
          id={props.id}
          title={props.title}
          open={showTitle}
          setShowTitle={setShowTitle}
        />
      )}
      {showDelete && (
        <DeleteModal
          id={props.id}
          title={props.title}
          open={showDelete}
          setShowDelete={setShowDelete}
          redirectAfterDelete={props.redirectAfterDelete}
        />
      )}
    </div>
  );
}

function TitleModal(props: {
  id: string;
  title: string;
  open: boolean;
  setShowTitle: (v: boolean) => void;
}) {
  const [title, setTitle] = useState("New Chat");
  const { getData } = useContext(chatContext) as { getData: () => Promise<void> };

  useEffect(() => {
    setTitle(props.title);
  }, [props.title]);

  return (
    <Modal
      title="修改标题"
      open={props.open}
      onCancel={() => props.setShowTitle(false)}
      onOk={async () => {
        const res = (await updateTitleById(props.id, title)) as { code?: number };
        if (res && res.code === 0) {
          message.success("修改成功");
          await getData();
          props.setShowTitle(false);
        }
      }}
    >
      <Input
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
    </Modal>
  );
}

function DeleteModal(props: {
  id: string;
  title: string;
  open: boolean;
  setShowDelete: (v: boolean) => void;
  redirectAfterDelete: string;
}) {
  const nav = useNavigate();
  const { getData } = useContext(chatContext) as { getData: () => Promise<void> };

  return (
    <Modal
      title="删除聊天"
      open={props.open}
      onCancel={() => props.setShowDelete(false)}
      onOk={async () => {
        const res = (await deleteChatById(props.id)) as {
          code?: number;
          data?: { data?: unknown[] };
        };
        if (res && res.code === 0 && res.data?.data && res.data.data.length > 0) {
          message.success("删除成功");
          await getData();
          nav({ to: props.redirectAfterDelete });
          props.setShowDelete(false);
        }
      }}
    >
      {props.title}
    </Modal>
  );
}
