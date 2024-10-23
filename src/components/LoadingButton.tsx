

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
import { LoadingButton } from '@mui/lab';

type props = {
    isLoading: boolean;
    handleOnclick?: (val: any) => void;
    disabled?: boolean;
    btnText: string;
    style?: any;
    type?: 'button' | 'submit' | 'reset' | undefined;
    endIcon?: React.ReactNode;
    color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | undefined;
}

export const LoadingButtonComponent: React.FC<props> = ({
    isLoading,
    handleOnclick,
    disabled = false,
    btnText = 'Submit',
    style,
    type = 'button',
    endIcon,
    color = 'primary'
}) => {

    return (
        <LoadingButton
            type={type}
            loading={isLoading}
            endIcon={endIcon? endIcon : <></>}
            loadingPosition="end"
            variant="contained"
            size="medium"
            onClick={handleOnclick}
            disabled={disabled}
            color={color}
            sx={{
                ...style,
                '&.MuiButtonBase-root:hover':{
                    background: style?.backgroundColor
                }
            }}
        >
            {btnText}
        </LoadingButton>
    );
}
