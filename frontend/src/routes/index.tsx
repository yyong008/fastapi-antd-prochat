import { Link, createFileRoute } from '@tanstack/react-router'

import { ArrowRightOutlined } from '@ant-design/icons'

export const Route = createFileRoute('/')({
  component: HomeRoute
})

function HomeRoute() {
  return <div className='w-[100vw] h-[100vh] flex justify-center items-centerv border-dashed'>
    <Link to="/chat" className='text-2xl font-bold  hover:text-blue-700 transition-colors duration-300 flex items-center'>Go Chat <ArrowRightOutlined /></Link>
  </div>
}
