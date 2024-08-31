import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/dashboard')({
  component: () => <div>Hello /_admin/dashboard!</div>
})