import {
  FC,
  ReactElement,
  useState
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  Menu,
  MenuItem,
  useProSidebar,
  menuClasses,
  sidebarClasses,
  SubMenu
} from "react-pro-sidebar";
import {
  Box,
  useTheme
} from "@mui/material";
import {
  useSidebar,
  useSidebarSelectedMenuTitleContext,
  useTemplateThemeModeContext,
} from "../hooks";
import { TemplateThemeModeContextType } from "../context";
import logo from "../assets/images/logo.png";
import { routes } from "@/routes";
import { useDispatch, useSelector } from "react-redux";
import { IRoute } from "@/types/RouteType";
import { useSidebarParentMenuContext } from "@/hooks/useSidebarSelectedMenuTitleContext";
import { AdminRoles } from "@/utils/commonData";
import { getItemFromStorage } from "@/utils/auth";


const SideBar: FC = (): ReactElement => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { collapsed, broken, collapseSidebar } = useProSidebar();
  const {
    toggle,
    menuItemStyles,
  } = useSidebar();
  const { menuItem, setMenuItem } = useSidebarSelectedMenuTitleContext();
  const { parentMenu, setParentMenu } = useSidebarParentMenuContext();
  const { isDark } = useTemplateThemeModeContext() as TemplateThemeModeContextType;
  const role = getItemFromStorage('auth').Role;

  const menuItemMouseUpHandler = (item: any) => {
    setMenuItem(item)
  }

  const dashboard = routes.filter((x: any) => x.key === 'dashboard'); var otherRoutes:any = [];
  if(AdminRoles.includes(role)){
    otherRoutes = routes.filter((x: any) => x.key !== 'dashboard' && x.key !== 'page404');
  }
  else {
    otherRoutes = routes.filter((x: any) => x.key !== 'dashboard' && x.key !== 'page404' && x.key !== 'admin');
  }

  return (
    <Sidebar
      rtl={false}
      breakPoint="sm"
      transitionDuration={800}
      collapsedWidth={'75px'}
      rootStyles={{
        // width: '100px !important',
        // minWidth: '100px !important',
        border: 'unset',
        [`.${sidebarClasses.container}`]: {
          color: isDark ? theme.palette.common.black : theme.palette.common.black,
          background: theme.palette.common.blueColors.level2,
          borderRadius: '7px 7px 0 0',
          margin: '0 0 0 3px',
          // height: 'calc(100vh - 65px)',
          marginBottom: '0 !important'
        },
      }}
    >
    <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
      {collapsed && (
        <img src={logo} style={{ width: '100%', padding: '5px' }} ></img>
      )}
      {!collapsed && (
        <Box sx={{
          width: '130px',
          height: '90px',
        }}>
          <img src={logo} style={{ width: '100%', padding: '10px' }} ></img>
        </Box>
      )}
    </Box>
      <Menu menuItemStyles={menuItemStyles}>

        <Box sx={{ marginTop: collapsed || broken ? '3rem' : '15px' }}>
          {dashboard.map(item => item.enabled ? (
            <MenuItem
              key={item.key}
              active={menuItem.key === item.key}
              icon={item.icon}
              onClick={() => (navigate(item.path, { replace: true }))}
              onMouseUp={() => menuItemMouseUpHandler(item)}
              rootStyles={{
                ['.' + menuClasses.button]: {

                  '&:focus': {
                    backgroundColor: 'rgba(197, 228, 255, 1)',
                    color: '#44596e',
                    outline: 'none'

                  },
                },
              }}
            >
              {item.title}
            </MenuItem>
          ) : <div key={item.key}></div>)}
          {otherRoutes.map((item: IRoute) => (
            <SubMenu label={item.title} key={item.key} icon={item.icon}
              onClick={() => {
                if (parentMenu === item.key) {
                  setParentMenu('')
                }
                else {
                  setParentMenu(item.key)
                }
              }}
              open={parentMenu === item.key}
            >
              {collapsed && (
                <MenuItem key={item.key} style={{
                  'textAlign': 'center',
                  'background': '#bfc7ff',
                  'zIndex': 9,
                  'marginTop': '5px !important',

                }}
                // icon={item.icon}
                >
                  {item.title}
                </MenuItem>
              )}
              {item.subMenus.map((subItem: IRoute) => (
                <MenuItem
                  key={subItem.key}
                  active={menuItem.key === subItem.key}
                  icon={subItem.icon}
                  onClick={() => {
                    navigate(subItem.path, { replace: true })
                  }}
                  onMouseUp={() => menuItemMouseUpHandler(subItem)}
                  rootStyles={{
                    ['.' + menuClasses.button]: {

                      '&:focus': {
                        backgroundColor: 'rgba(197, 228, 255, 1)',
                        color: '#44596e',
                        outline: 'none'

                      },
                    },
                  }}
                >
                  {subItem.title}
                </MenuItem>
              ))}
            </SubMenu>
          ))}
        </Box>
      </Menu>
    </Sidebar>
  )
}

export default SideBar;