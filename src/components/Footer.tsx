import { FC, ReactElement } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useTemplateThemeModeContext } from "../hooks";
import { TemplateThemeModeContextType } from "../context";

export const Footer: FC = (): ReactElement => {
  const theme = useTheme()
  const { isDark } = useTemplateThemeModeContext() as TemplateThemeModeContextType;
  return (
    <Box
      id="footer"
      sx={{
        width: "100%",
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 10px'
      }}
    >
      <Typography
        fontSize={12}
        padding={0}
        color={theme.palette.common.white}
        variant="subtitle2">
        KBZ Bank © 2024 / All Right Reserved.
      </Typography>
      <Typography
        fontSize={12}
        padding={0}
        color={theme.palette.common.white}
        variant="subtitle2">
        version 1.2.0
      </Typography>
    </Box>
  );
};

export default Footer;
