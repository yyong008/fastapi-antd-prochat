import { Button, Input, Select, message } from "antd";

import { createFileRoute } from "@tanstack/react-router";
import { createTranslate } from "../../apis/transalte";
import { useState } from "react";

export const Route = createFileRoute("/tanslate/")({
  component: RouteComponent,
});

const options = [
  { label: "中文", value: "Chinese" },
  { label: "英文", value: "English" },
  { label: "日语", value: "Japanese" },
  { label: "韩语", value: "Korean" },
  { label: "法语", value: "French" },
  { label: "德语", value: "German" },
  { label: "西班牙语", value: "Spanish" },
  { label: "葡萄牙语", value: "Portuguese" },
  { label: "俄语", value: "Russian" },
  { label: "阿拉伯语", value: "Arabic" },
  { label: "泰语", value: "Thai" },
  { label: "越南语", value: "Vietnamese" },
];

function RouteComponent() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    lang_from: "",
    lang_to: "",
    content: "",
    content_t: "",
  });

  return (
    <div className="flex flex-col justify-center items-center gap-6">
      <div className="flex flex-col justify-end items-center my-[20px] ">
        <div className="text-[50px] font-boldchat">AI 翻译</div>
        <div className="text-[20px]">选择语言</div>
        <div className="flex gap-3 my-[20px]">
          <div>
            <Select
              className="w-[200px]"
              options={options}
              placeholder="选择语言"
              onChange={(value) => {
                setData((prev) => ({ ...prev, lang_from: value }));
              }}
            ></Select>
          </div>
          <div>
            <Select
              className="w-[200px]"
              options={options}
              placeholder="选择语言"
              onChange={(value) => {
                setData((prev) => ({ ...prev, lang_to: value }));
              }}
            ></Select>
          </div>
        </div>
      </div>
      <div className="flex gap-3 ">
        <div>
          <Input.TextArea
            style={{
              height: "100%",
            }}
            className="w-[600px]"
            value={data.content}
            onChange={(e) => {
              setData((prev) => ({ ...prev, content: e.target.value }));
            }}
          />
        </div>
        <div className="h-[500px] ">
          <Input.TextArea
            style={{
              height: "100%",
            }}
            className="w-[600px]"
            value={data.content_t}
          />
        </div>
      </div>
      <div>
        <Button
          type="primary"
          loading={loading}
          onClick={async () => {
            if(!data.lang_from || !data.lang_to || !data.content) {
              message.error('请填写完整');
              return;
            }
            setLoading(true);
            const res: any = await createTranslate(data);
            setLoading(false);
            if (res && res.code === 0) {
              setData((prev) => ({ ...prev, content_t: res.data }));
              return;
            }

            message.error(res.message);
            return;
          }}
        >
          翻译
        </Button>
      </div>
    </div>
  );
}
