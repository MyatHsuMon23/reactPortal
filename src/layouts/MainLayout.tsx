import { FC, ReactElement, ReactNode } from "react";
import { Box, CssBaseline } from "@mui/material";
import Main from "../components/Main";
import SideBar from "../components/Sidebar";
import Header from "../components/Header";
import Content from "../components/Content";
import { useTemplateDirectionContext } from "../hooks";
import { useProSidebar } from "react-pro-sidebar";
import { useSidebarParentMenuContext } from "@/hooks/useSidebarSelectedMenuTitleContext";
import { SidebarFooter } from "@/components/SidebarFooter";


interface LayoutProps {
  children: ReactNode;
}
const Layout: FC<LayoutProps> = ({ children }): ReactElement => {
  const { rtl } = useTemplateDirectionContext();
  const { collapsed } = useProSidebar();
  const flexDirection: string = rtl ? "row-reverse" : "row"
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { flexDirection },
          maxHeight: "100vh",
          maxWidth: "100vw",
          flexGrow: 1,
          background: 'aliceblue'
        }}
      >
        {/* <CssBaseline /> */}
        <SideBar />
        <Main >
          <Box sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            background: 'aliceblue',
            padding: '0 10px',
          }}>
            <Header />
          </Box>
          <Content>
            {children}
          </Content>
          <SidebarFooter collapsed={collapsed} />
        </Main>
      </Box>
    </Box>
  );
};

export default Layout;