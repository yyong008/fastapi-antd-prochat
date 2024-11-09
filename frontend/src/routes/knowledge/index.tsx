import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/knowledge/')({
  component: () => <div>Hello /knowledge/!</div>
})