import { Button, Card, FloatButton, Form, Input, Modal, Spin, Tooltip } from "antd";
import { EditFilled, HomeOutlined, MoreOutlined } from "@ant-design/icons";
import { Link, createFileRoute } from "@tanstack/react-router";
import { createKnowledge, deleteKnowledge, getKnowledges } from "../../apis/knowledge";

import { useEffect } from "react";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";

export const Route = createFileRoute("/knowledge/")({
  component: RouteCm,
});

function RouteCm() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false)

  const getData = async () => {
    setLoading(true)
    const result: any = await getKnowledges();
    setData(result);
    setLoading(false)
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="w-[100vw] h-[100vh] flex flex-col items-center bg-slate-50 bg-[url('https://images.pexels.com/photos/8386487/pexels-photo-8386487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')]">
      <div className="py-[20px]">
        <h1 className="text-[40px] font-bold">知识库</h1>
      </div>
      <CreateKnowledgeModal />
      <Spin spinning={loading}>
        <KnowledgeList list={data || []} getData={getData}/>
      </Spin>
      <div>
        <Link to="/">
          <FloatButton type="primary" icon={<HomeOutlined />}></FloatButton>
        </Link>
      </div>
    </div>
  );
}

function CreateKnowledgeModal(props) {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const createKnowledgeHandler = async () => {
    const data = {
      name: form.getFieldValue("name"),
      description: form.getFieldValue("description"),
    };
    const result = await createKnowledge(data);
  };
  return (
    <div className="my-[20px]">
      <Button icon={<EditFilled />} onClick={() => setVisible(!visible)}>
        创建知识库
      </Button>
      {visible && (
        <Modal
          title="创建知识库"
          open={visible}
          onOk={createKnowledgeHandler}
          onCancel={() => setVisible(false)}
        >
          <Form form={form}>
            <Form.Item
              label="name"
              name="name"
              labelCol={{ span: 5 }}
              required={true}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="description"
              name="description"
              labelCol={{ span: 5 }}
              required={true}
            >
              <Input.TextArea />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
}

function KnowledgeList({ list, getData }) {
  if(!list) return null
  if (list?.length === 0) return <div>暂无数据</div>;
  return (
    <div className="flex flex-wrap gap-3">
      {list?.map((item) => {
        return <KnowledgeCard item={item} getData={getData}/>;
      })}
    </div>
  );
}

function KnowledgeCard({ item, getData }) {
  return (
    <Card title="知识库" className="w-[300px]" extra={<TooltipDelete id={item.id} getData={getData} />}>
      <Link to={"/knowledge/" + item.id}>
        <div className="text-[20px] font-bold">{item.name}</div>
        <div className="text-gray-500 text-[12px] mt-[20px]">{item.description}</div>
      </Link>
    </Card>
  );
}
  
function TooltipDelete({id,getData}) {
  const deleteKnowledgeHandler = async () => {
    const result = await deleteKnowledge(id)
    getData()
  }
  return (
    <Tooltip title="删除">
      <MoreOutlined onClick={deleteKnowledgeHandler} />
    </Tooltip>
  );
}
