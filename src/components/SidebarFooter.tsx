import React from 'react';
import { Box } from '@mui/material';
import Footer from './Footer';

interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  collapsed?: boolean;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ children, collapsed, ...rest }) => {
  return (
    <Box sx={{
      width: !collapsed ? 'calc(100vw - 250px)': '100%',
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "10px",
      color: "white",
      background: '#404040',
      // position: "sticky",
      // bottom: "5px",
      // borderRadius: "5px",
      marginTop: "20px",
      // marginBottom: '5px',
      minHeight: "50px"
    }}>
      <Footer />
    </Box >
  );
};
