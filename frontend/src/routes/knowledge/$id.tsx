import { Button, FloatButton, Upload, message } from "antd";
import { CheckCard, ProCard } from "@ant-design/pro-components";
import {
  FileTextOutlined,
  HomeOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Link, createFileRoute, useParams } from "@tanstack/react-router";
import { addFileToKnowledge, getKnowledgeById } from "../../apis/knowledge";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/knowledge/$id")({
  component: RoutComponent,
});

function RoutComponent() {
  const { id } = useParams({ strict: true, from: "" });
  const [selectFile, setSelectFile] = useState("");
  const [data, setData] = useState({
    info: {
      name: "",
      description: "",
    },
    files: [],
  });

  const getData = async () => {
    const res = await getKnowledgeById(id);
    setData((pd) => {
      return {
        ...pd,
        ...res,
      };
    });
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="w-[100vw] min-h-[100vh] flex flex-col items-center bg-slate-50 bg-[url('https://images.pexels.com/photos/8386487/pexels-photo-8386487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')]">
      <div className="flex flex-col items-center py-[20px]">
        <h1 className="text-[40px] font-bold">知识库： {data.info.name}</h1>
        <div className="text-[12px]">{data.info.description}</div>
      </div>
      <UploadFileContent id={id} getData={getData} />
      <div className="flex gap-3">
        <FileList
          files={data.files}
          selectFile={selectFile}
          setSelectFile={setSelectFile}
        />
        <FileContent files={data.files} selectFile={selectFile} />
      </div>
      <div>
        <Link to="/">
          <FloatButton type="primary" icon={<HomeOutlined />}></FloatButton>
        </Link>
      </div>
    </div>
  );
}

function UploadFileContent(props) {
  const handleUploadChange = async (info) => {
    const { status, response } = info.file;

    if (status === "uploading") {
      console.log("Uploading file...");
    }

    if (status === "done") {
      // 文件上传成功
      message.success(`${info.file.name} 上传成功`);

      // 假设服务器返回的响应中包含 `content` 字段作为文件内容
      if (response) {
        const result = await addFileToKnowledge(props.id, {
          id: response.id,
        });

        console.log("File content:", response.content);
        props.getData()
      } else {
        message.error("服务器未返回文件内容");
      }
    } else if (status === "error") {
      message.error(`${info.file.name} 上传失败`);
    }
  };
  return (
    <Upload {...props} action="/api/upload/file" onChange={handleUploadChange} multiple={false}>
      <Button icon={<UploadOutlined />}>上传文件</Button>
    </Upload>
  );
}

function FileList({ files, selectFile, setSelectFile }) {
  return (
    <div className="">
      <h1 className="text-[20px] font-bold">文件列表</h1>
      <div></div>
      <CheckCard.Group
        onChange={(id) => {
          setSelectFile(id);
        }}
      >
        {files?.map((file) => {
          return (
            <div>
              <CheckCard
                description={
                  <div className="flex gap-3 ">
                    <FileTextOutlined />
                    <div className="line-clamp-1">{file.meta.name}</div>
                  </div>
                }
                checked={file.id === selectFile}
                value={file.id}
              />
            </div>
          );
        })}
      </CheckCard.Group>
    </div>
  );
}

function FileContent({ selectFile, files }) {
  const content = files?.find((file) => file.id === selectFile)?.data?.content;
  return (
    <ProCard className="w-[600px]">
      {!selectFile ? <div>请选择文件</div> : <div>{content}</div>}
    </ProCard>
  );
}
