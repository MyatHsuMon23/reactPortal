import { FC, ReactElement, useState } from "react";
import {
  IconButton,
  Toolbar,
  Typography,
  Box,
  useTheme,
  Tooltip,
} from "@mui/material";
import { Menu as IconMenu, StarOutline } from "@mui/icons-material";
import { useProSidebar } from "react-pro-sidebar";
import {
  useSidebar,
  useSidebarSelectedMenuTitleContext,
  useTemplateThemeModeContext,
} from "../hooks";
import { TemplateThemeModeContextType } from "../context";
import { cleanStorage, getItemFromStorage } from '../utils/auth';
import { Logout } from '@mui/icons-material';
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../redux/actionTypes/authActionTypes";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { RootState } from "../redux/store/store";
import { useNavigate } from "react-router-dom";
import Popover from '@mui/material/Popover';

const Navbar: FC = (): ReactElement => {
  var mnuHeaderHeight = document.getElementById("sidebarMnuHeader")?.clientHeight
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSignOut = () => {
    dispatch({ type: ActionType.LOG_OUT, payload: null });
    cleanStorage();
    navigate('/');
  };


  const theme = useTheme()
  const { menuItem } = useSidebarSelectedMenuTitleContext();
  const { collapsed, broken } = useProSidebar();
  const { toggle } = useSidebar();
  const { isDark } = useTemplateThemeModeContext() as TemplateThemeModeContextType;
  const { auth } = useSelector((state: RootState) => state.auth);
  const name = getItemFromStorage('auth')?.name || auth.name;
  const role = getItemFromStorage('auth')?.Role || auth.Role;
  const LoginId = getItemFromStorage('auth')?.LoginId || auth.LoginId;
  const branchCode = getItemFromStorage('auth')?.branchCode || auth.branchCode

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <>
      <Box sx={{
        width: "100%",
        height: '60px',
        background: theme.palette.primary.main,
        boxShadow: '0px 3px 4px 1px rgb(129 127 127 / 20%)',
        // marginTop: '5px',
        borderRadius: '7px'
      }}>
        <Toolbar disableGutters sx={{
          minHeight: '100% !important',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          padding: '0 2em'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={toggle}
              style={{ padding: 0, marginRight: '10px' }}
              sx={{
                color: isDark ? theme.palette.common.white : theme.palette.common.white
              }}
            >
              <IconMenu />
            </IconButton>
            <Typography
              variant="h6"
              color={theme.palette.common.white}
              textAlign={'center'}
            >
              CDMS Portal
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              py: 0,
              my: 0,
              gap: '1.5em'
            }}>
              {/* <TextField
              size='small'
              variant="outlined"
              // label="Search"
              placeholder="Search"
              autoComplete='off'
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Search fontSize='small' style={{ cursor: 'pointer', color: theme.palette.primary.main }} />
                  </InputAdornment>
                ),
              }}
            /> */}
              {/* <Notifications style={{ cursor: 'pointer', color: theme.palette.common.white }} /> */}
              <Tooltip title="Profile">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  aria-controls={open ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                >
                  <AccountCircleIcon style={{
                    color: theme.palette.common.white,
                    width: '30px',
                    height: '30px',
                    marginRight: '10px'
                  }} />
                  <div>
                    <Typography color={theme.palette.common.white}>{name}</Typography>
                    <span style={{
                      fontSize: '12px',
                      color: theme.palette.common.white,
                    }}>[ {LoginId} | {role} ]</span>
                  </div>
                </IconButton>
              </Tooltip>
              <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                sx={{
                  '& .MuiPopover-paper': {
                    height: 'max-content',
                    width: '270px',
                    borderRadius: '5px',
                    marginTop: '5px'
                  }
                }}
              >
                <Box
                  sx={{
                    height: '100%'
                  }}>
                  <Box sx={{
                    width: '100%',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <AccountCircleIcon sx={{
                      margin: '5px',
                      fontSize: '3.5em',
                      color: '#6e42ff'
                    }}></AccountCircleIcon>
                    <Typography textAlign={'center'}>{name} ({role})</Typography>
                    <Typography sx={{ marginTop: '10px' }}>[ {LoginId} | {branchCode} ]</Typography>
                  </Box>
                  <hr style={{
                    width: '100%',
                    height: '2px',
                    background: '#6e42ff',
                    margin: '0px',
                    marginTop: '10px',
                  }} />
                  <div onClick={handleSignOut} 
                  style={{
                    backgroundColor: '#bfc7ff',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '5px',
                    cursor: 'pointer',
                    padding: '10px'
                  }}>
                    Logout <Logout fontSize="small" />
                  </div>
                </Box>
              </Popover>
            </Box>
          </Box>
        </Toolbar>
      </Box>

      {menuItem.title != 'Dashboard' && (
        <Typography
          borderRadius='5px'
          marginTop={'5px'}
          fontSize={16}
          fontWeight={600}
          padding={'7px'}
          display={'flex'}
          alignItems={'center'}
          gap={'10px'}
          sx={{
            background: theme.palette.common.gradient2
          }}
          variant="h5">
          <StarOutline color="primary" />{menuItem.title}<StarOutline color="primary" />
        </Typography>
      )}
    </>
  );
};

export default Navbar;
