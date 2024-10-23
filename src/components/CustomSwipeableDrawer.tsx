import { useCommonDataContext } from '@/hooks/useSidebarSelectedMenuTitleContext';
import { Box, SwipeableDrawer } from '@mui/material';
import { FC, ReactElement, ReactNode } from "react";
import { useSearchParams } from 'react-router-dom';

interface Props {
    children: ReactNode;
    open: boolean;
    setOpenDrawer: (val: boolean) => void;
    width?: string;
}

export const CustomSwipeableDrawer: FC<Props> = ({ children, open, setOpenDrawer, width = '70vw' }): ReactElement => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { isStillLoading, setStillLoading } = useCommonDataContext();

    return (
        <SwipeableDrawer
            anchor={"right"}
            open={open}
            onClose={() => {
                if (!isStillLoading) {
                    setSearchParams(new URLSearchParams());
                    setOpenDrawer(false)
                }
            }}
            onOpen={() => setOpenDrawer(true)}
            sx={{
                overflow: 'scroll'
            }}
        >
            <Box sx={{
                width: width,
            }}
                role="presentation">
                {children}

            </Box>
        </SwipeableDrawer>
    );
}
