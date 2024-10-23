import { FC, ReactElement } from "react";
import { Box } from "@mui/system";
import Navbar from "./Navbar";


export const Header: FC = (): ReactElement => {
  return (
    <Box sx={{ position: 'sticky', top: '0', zIndex: '10', background: '#f8f8f8' }}>
      <Navbar />
    </Box>
  );
};

export default Header;