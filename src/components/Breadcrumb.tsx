import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';
import { useSidebarSelectedMenuTitleContext } from '@/hooks';
import { Box } from "@mui/system";
import { theme } from '@/styles/GlobalStyle';

export default function Breadcrumb(props: any) {
    const { menuItem } = useSidebarSelectedMenuTitleContext();
    const LinkStyled = {
        display: 'flex',
        alignItems: 'center',
        fontSize: '16px',
        color: theme.palette.primary.main,
        'svg': {
            fontSize: '20px',
            marginRight: '5px',
            color: theme.palette.primary.main
        }
    }

    return (
        <Box role="presentation" sx={{
            padding: '10px',
            background: '#f8f8f8',
            zIndex: 9
        }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{
                '& .MuiBreadcrumbs-separator': {
                    color: theme.palette.primary.main
                }
            }}>
                <Link
                    underline="hover"
                    sx={LinkStyled}
                    href="/"
                >
                    <HomeIcon sx={{ mr: 0.5 }} style={{ fontSize: '16px', fontWeight: '600' }} />
                    Home
                </Link>
                {menuItem.title != "Dashboard" && (
                    <Link
                        underline="hover"
                        sx={LinkStyled}
                        href={menuItem.path}
                    >
                        {/* {menuItem.icon} */}
                        {menuItem.title}
                    </Link>
                )}
            </Breadcrumbs>
        </Box>
    );
}