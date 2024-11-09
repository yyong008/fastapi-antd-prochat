import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/knowledge/$id')({
  component: () => <div>Hello /knowledge/$id!</div>
})