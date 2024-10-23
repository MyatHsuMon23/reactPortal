import { Snackbar } from '@mui/material';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';
import Slide, { SlideProps } from '@mui/material/Slide';

type Props = {}

const ToastAlert = (props: Props) => {
  const dispatch = useDispatch();
  const { isOpen, status, message, description } = useSelector((state: RootState) => state.toast);

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
  ) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
  });

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch({ type: 'CLOSE_TOAST_ALERT', payload: { isOpen: false } });
  };

  function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction="down" />;
  }

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      TransitionComponent={SlideTransition}
    >
      <Alert onClose={handleClose} severity={status as AlertColor}
        sx={{
          height: 'auto',
          whiteSpace: 'pre-line',
          padding: '7px 10px',
        }}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default ToastAlert