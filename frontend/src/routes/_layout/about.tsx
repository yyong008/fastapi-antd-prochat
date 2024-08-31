import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/about')({
  component: () => <div>Hello /_layout/about!</div>
})