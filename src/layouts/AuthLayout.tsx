import { FC, ReactNode } from "react";
import BankCards from "../assets/images/card2.png";
import financial from "../assets/images/financial.png";
import {
  Box,
  Typography,
  useTheme,
  Grid
} from "@mui/material";

type AuthLayoutProps = {
  children: ReactNode;
}
const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  const theme = useTheme();

  return (
    <Grid
      container
      height='100vh'
      width='100%'
    >
      <Grid container spacing={3} style={{ background: theme.palette.common.gradient }}>
      <Grid item xs={10} sm={6} display={'flex'} alignItems={'center'}
      >
        <img src={BankCards} width={'100%'} style={{
          transform: 'scaleX(-1)'
        }}></img>
      </Grid>
      <Grid item xs={10} sm={6} display={'flex'} alignItems={'center'} justifyContent={'center'}>
        <Box width={'53%'} display={'flex'} flexDirection={'column'} alignItems={'center'}>
          {/* <img src={financial} width={'37%'}></img> */}
          <Typography variant="h4" color={theme.palette.common.black} textAlign={'center'} marginBottom={'2rem'}>Card Management Portal</Typography>
          {children}
        </Box>
      </Grid>
    </Grid >
    </Grid>
  )
};

export default AuthLayout;
