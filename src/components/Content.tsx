import { FC, ReactElement, ReactNode } from "react";
import { Box, Card } from "@mui/material";
import Breadcrumb from "./Breadcrumb";
import { useSidebarParentMenuContext } from "@/hooks/useSidebarSelectedMenuTitleContext";
import { routes } from "@/routes";

interface ContentProps {
  children: ReactNode;
}

export const Content: FC<ContentProps> = ({ children }): ReactElement => {
  var mnuHeaderHeight = document.getElementById("sidebarMnuHeader")?.clientHeight
  var footerHeight = document.getElementById("footer")?.clientHeight
  const height: string =
    'calc(100% - '
    + (mnuHeaderHeight ? mnuHeaderHeight : 0 + (footerHeight ? footerHeight : 0)).toString()
    + ')'
  return (
    <Box
      sx={{
        minHeight: height,
        maxWidth: "100vw",
        flexGrow: 1,
        padding: '0 10px'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          my: '0',
          mx: 'auto',
          height: '100%',
          width: { xs: '100%', sm: '100%', md: '100%', lg: '100%', xl: '100%' },

          overflowY: 'scroll',
          overflowX: 'hidden',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default Content;