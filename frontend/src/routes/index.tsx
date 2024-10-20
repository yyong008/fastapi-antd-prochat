import { Link, createFileRoute } from "@tanstack/react-router";

import { ArrowRightOutlined } from "@ant-design/icons";

export const Route = createFileRoute("/")({
  component: HomeRoute,
});

function HomeRoute() {
  return (
    <div className="w-[100vw] h-[100vh] flex flex-col justify-center items-center border-dashed">
      <Link
        to="/chat"
        className="text-2xl font-bold  hover:text-blue-700 transition-colors duration-300 flex items-center"
      >
        Go Chat <ArrowRightOutlined />
      </Link>
      <Link
        to="/langchain-chat"
        className="text-2xl font-bold  hover:text-blue-700 transition-colors duration-300 flex items-center"
      >
        Go LangChain Chat <ArrowRightOutlined />
      </Link>
       <Link
        to="/tanslate"
        className="text-2xl font-bold  hover:text-blue-700 transition-colors duration-300 flex items-center"
      >
        Go Translate <ArrowRightOutlined />
      </Link>
    </div>
  );
}
