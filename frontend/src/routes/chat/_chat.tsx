import { Outlet, createFileRoute } from '@tanstack/react-router'

import { Select } from 'antd'

export const Route = createFileRoute('/chat/_chat')({
  component: ChatLayoutRoute
})

function ChatLayoutRoute() {
  return <div className="flex justify-center items-center w-[100%]">
      <div className="flex flex-col  items-center w-[80%] h-[94vh]">
        <div className="flex justify-center items-center pt-[20px]">
          <span>模型：</span>
          <Select
            defaultValue="glm-4-flash"
            style={{ width: 120 }}
            onChange={() => {}}
            options={[
              { value: "glm-4-flesh", label: "glm-4-flash" },
            ]}
          />
        </div>
        <Outlet />
      </div>
    </div>
}
