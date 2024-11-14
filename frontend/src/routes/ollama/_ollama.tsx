import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useContext, useEffect, useState } from "react";

import { Select } from "antd";
import { getOllamaModels } from "../../apis/ollama";
import { ollamaContext } from "../../context";

export const Route = createFileRoute("/ollama/_ollama")({
  component: ChatLayoutRoute,
});

function ChatLayoutRoute() {
  const oc = useContext(ollamaContext);
  const [modelName, setModelName] = useState("");
  const [data, setData] = useState([]);
  const getModelList = async () => {
    const data: any = await getOllamaModels();
    setData(data?.models ?? []);
  };
  useEffect(() => {
    getModelList();
  }, []);
  return (
    <ollamaContext.Provider value={{ model_name: modelName }}>
      <div className="flex justify-center items-center w-[100%]">
        <div className="flex flex-col  items-center w-[80%] h-[94vh]">
          <div className="flex justify-center items-center pt-[20px]">
            <span>模型：</span>
            <Select
              style={{ width: 120 }}
              onChange={(mn) => {
                setModelName(mn);
              }}
              options={[
                ...data?.map((item) => ({
                  value: item.name,
                  label: item.name,
                })),
              ]}
            />
          </div>
          <Outlet />
        </div>
      </div>
    </ollamaContext.Provider>
  );
}
