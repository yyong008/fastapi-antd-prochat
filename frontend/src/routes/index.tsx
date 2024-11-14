import { Link, createFileRoute } from "@tanstack/react-router";

import { ArrowRightOutlined } from "@ant-design/icons";

export const Route = createFileRoute("/")({
  component: HomeRoute,
});

function HomeRoute() {
  return (
    <div className="w-[100vw] h-[100vh] py-[30px] flex flex-col items-center border-dashed  bg-[url('https://images.pexels.com/photos/8386487/pexels-photo-8386487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center">
      <div className="text-4xl font-bold my-[100px]">FastAPI Antd ProChat</div>
      <ol>
        <LinkTo to="/chat" go="Go Chat" />
        <LinkTo to="/langchain-chat" go="Go LangChain Chat" />
         <LinkTo to="/ollama" go="Go Ollama Chat" />
        <LinkTo to="/translate" go="Go Translate" />
        <LinkTo to="/knowledge" go="Go Knowledge" />
      </ol>
    </div>
  );
}

function LinkTo({ to, go }) {
  return (
    <li className="mb-4">
      <Link
        to={to}
        className="text-2xl font-bold  hover:text-blue-700 transition-colors duration-300 flex items-center"
      >
        {go} <ArrowRightOutlined className="text-gray-500 mx-[10px]" />
      </Link>
    </li>
  );
}
