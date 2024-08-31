import { Button, Layout } from "antd";
import { Link, Outlet, createFileRoute } from "@tanstack/react-router";

const { Header, Footer, Content } = Layout;

const headerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  paddingInline: 48,
  lineHeight: "64px",
  backgroundColor: "#4096ff",
};

const contentStyle: React.CSSProperties = {
  textAlign: "center",
  minHeight: 120,
  lineHeight: "120px",
  color: "#fff",
  flex: 1,
  backgroundColor: "#0958d9",
};

const footerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#4096ff",
};

const layoutStyle: React.CSSProperties = {
  // borderRadius: 8,
  overflow: "hidden",
  // width: 'calc(50% - 8px)',
  // maxWidth: 'calc(50% - 8px)',
  height: "100vh",
};

export const Route = createFileRoute("/_layout")({
  component: () => (
    <div>
      <Layout style={layoutStyle}>
        <Header style={headerStyle}>
          <HeaderContent />
        </Header>
        <Content style={contentStyle}>
          <Outlet />
        </Content>
        <Footer style={footerStyle}>Footer</Footer>
      </Layout>
    </div>
  ),
});

function HeaderContent() {
  return (
    <div style={{ display: 'flex', color: "white", justifyContent:"space-between" }}>
      <div>
        <Link to="/" style={{ color: "white", marginRight: '10px' }}>
          Home
        </Link>
        <Link to="/about" style={{ color: "white" }}>
          About
        </Link>
      </div>
      <div>
        <Link to="/login" style={{ color: "white" }}>
          <Button>Login</Button>
        </Link>
      </div>
    </div>
  );
}
