import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import { useDispatch } from 'react-redux';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function DialogModal() {
    const alertModal = useSelector(
        (state: RootState) => state.alert
    )
    const isOpen: boolean = alertModal.isModalOpen
    const dispatch = useDispatch();
    const handleClose = () => {
        dispatch({ type: 'OPEN_ALERT_MODAL', payload: {} });
    };
    const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('lg');

    return (
        <div>
            <BootstrapDialog
                maxWidth={maxWidth}
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={isOpen}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    {alertModal.message.title}
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <img src={alertModal.message.content} alt={alertModal.message.title}></img>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose} variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}
