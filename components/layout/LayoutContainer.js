import { Layout } from "antd";

const LayoutContainer = ({ children }) => {
  return <Layout style={{ minHeight: "100vh" }}>{children}</Layout>;
};
export default LayoutContainer;
