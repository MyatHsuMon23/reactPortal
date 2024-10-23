import { Box, CircularProgress } from "@mui/material";
import { FC, ReactElement } from "react";

const Loader: FC = (): ReactElement => {
  return (
    <Box sx={{ fluid: "true", display: "flex", position: 'absolute', top: '50%', left: '50%' }}>
      <CircularProgress />
    </Box>)
};

export default Loader;

import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';

type props={
  open: boolean;
}

export const LoaderWithBackdrop: React.FC<props> = ({
  open,
}) => {
  // const [open, setOpen] = React.useState(false);
  // const handleClose = () => {
  //   setOpen(false);
  // };
  // const handleOpen = () => {
  //   setOpen(true);
  // };

  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute' }}
      open={open}
    >
      <CircularProgress color="inherit" sx={{
            top: '45%',
            position: 'absolute'
      }}/>
    </Backdrop>
  );
}
