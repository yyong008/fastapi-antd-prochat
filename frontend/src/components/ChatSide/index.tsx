import { EditOutlined, HomeOutlined, MenuOutlined } from "@ant-design/icons";
import { Input, Modal, Popover, message } from "antd";
import {
  Link,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { deleteChatById, updateTitleById } from "../../apis/chat";
import { useContext, useEffect, useState } from "react";

import { chatContext } from "../../context/index";

export const ChatSide = () => {
  const { chats } = useContext(chatContext) as any;
  return (
    <div className="w-[200px] text-white p-[20px] h-[100vh] overflow-y-scroll">
      <Link to="/">
        <div className="flex justify-between p-[10px]">
          <span>主页</span>
          <HomeOutlined />
        </div>
      </Link>
      <Link to="/chat">
        <div className={`flex justify-between p-[10px] rounded-md`}>
          <span>新建聊天</span>
          <EditOutlined />
        </div>
      </Link>
      <div className="">
        <div>
          <div className="flex justify-between p-[10px] ">
            <span>聊天历史</span>
            <MenuOutlined />
          </div>
        </div>
        <ChatsList chats={chats ?? []} />
      </div>
    </div>
  );
};

function ChatsList({ chats }) {
  const p = useParams({ strict: false });
  const id = p["id"];
  return (
    <div className="overflow-y-auto">
      {chats.map((item, index) => {
        let title = "New Chat";
        if (item.title === title) {
          const chat = JSON.parse(item.chat);
          title = chat[0].content;
        } else {
          title = item.title;
        }
        return (
          <Link key={index} to={`/chat/${item.id}`}>
            <Popover
              trigger="hover"
              placement="rightBottom"
              title={""}
              content={<Content id={item.id} title={title} item={item} />}
            >
              <div
                className={`p-[10px] hover:bg-slate-400 rounded-md text-gray-300 text-[10px] ${id === item.id ? "bg-slate-600" : ""}`}
              >
                {(title || item.title).slice(0, 50)}
              </div>
            </Popover>
          </Link>
        );
      })}
    </div>
  );
}

function Content(props) {
  const [showTitle, setShowTitle] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleDelete = async () => {
    setShowDelete(true);
  };
  const handleModifyTitle = () => {
    setShowTitle(true);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="cursor-pointer" onClick={handleDelete}>删除</div>
      <div className="cursor-pointer" onClick={handleModifyTitle}>修改标题</div>
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
        />
      )}
    </div>
  );
}

function TitleModal(props) {
  const [title, setTitle] = useState("New Chat");
  const { getData } = useContext(chatContext) as any;
  useEffect(() => {
    setTitle(props.title);
  }, [props.title]);
  return (
    <Modal
      title="修改标题"
      open={props.open}
      onCancel={() => props.setShowTitle(false)}
      onOk={async () => {
        const res = await updateTitleById(props.id, title);
        if (res && res.code === 0) {
          // 删除成功
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

function DeleteModal(props) {
  const nav = useNavigate();
  const { getData } = useContext(chatContext) as any;
  return (
    <Modal
      title="删除聊天"
      open={props.open}
      onCancel={() => props.setShowDelete(false)}
      onOk={async () => {
        const res: any = await deleteChatById(props.id);
        if (res && res.code === 0 && res.data.data.length > 0) {
          // 删除成功
          message.success("删除成功");
          await getData();
          nav({ to: "/chat" });
          props.setShowDelete(false);
        }
      }}
    >
      {props.title}
    </Modal>
  );
}
