import { LoginComponent } from '../../components/login'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/login')({
  component: Login
})

function Login() {
  return <div style={{ display: 'flex',justifyContent: 'center', alignItems: 'center', width: "100vw", height: '100vh'}}>
    <LoginComponent />
  </div>
}
