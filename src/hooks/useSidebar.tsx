import React from "react";
import { useProSidebar } from "react-pro-sidebar";
import { MenuItemStyles } from "../types/SidebarTypes";
import { Theme, themes } from "../styles/CommonStyle";
import { useTheme } from "@mui/material";

export const useSidebar = () => {
  const { collapseSidebar, toggleSidebar, collapsed, toggled, broken } = useProSidebar();
  const [theme, setTheme] = React.useState<Theme>('light');
  const [hasImage] = React.useState<boolean>(false);
  const globalTheme = useTheme();

  const toggle = () => {
    toggleSidebar();
    if (toggled) {
      collapseSidebar();
    } else {
      if (!(broken && !collapsed)) {
        collapseSidebar();
      }
    }
  };
  const styled = collapsed || broken ? {
    fontSize: '13px',
    fontWeight: 400,
    width: '100%',
    marginTop: '5px',
    '& .ps-submenu-content': {
      maxWidth: '200px',
      width: 'max-content',
      '& .ps-menuitem-root': {
        marginTop: '0 !important',
        '& .ps-menu-label': {
          textWrap: 'wrap !important',
        }
      }
    }
  } :
    {
      fontSize: '13px',
      fontWeight: 400,
      background: '#a6b0ff',
      marginTop: '3px',
      '& .ps-submenu-content .ps-menuitem-root': {
        marginTop: '0 !important',
        background: '#d8dcfe',
        '& .ps-menu-label': {
          textWrap: 'wrap !important',
        }
      },
      '& .ps-submenu-content.ps-open': {
        background: '#bfc7ff',
      }
    }

  const activeStyled = collapsed || broken ? {
    color: '#FFF',
    // borderRadius: '10px',
    background: globalTheme.palette.primary.main,
    '& .ps-menu-icon': {
      color: '#FFF'
    }
  } :
    {
      background: globalTheme.palette.primary.main,
      // borderRadius: '10px',
      color: '#FFF',
      '& .ps-menu-icon': {
        color: '#FFF'
      }
    }

  const menuItemStyles: MenuItemStyles = {
    root: styled,
    icon: {
      color: themes[theme].menu.icon,
      [`&.${'ps-disabled'}`]: {
        color: themes[theme].menu.disabled.color,
      },
    },
    subMenuContent:{
      '& .ps-menu-button':{
        height: '40px !important',
        '&.ps-active':{
          height: '40px',
        }
      }
    },
    SubMenuExpandIcon: {
      color: 'black',
    },
    button: {
      paddingLeft: collapsed ? '15px' : '20px',
      height: '45px',
      '&.ps-active': activeStyled,
      '&.ps-menu-button.ps-open': {
        background: '#8190ff',
        marginTop: '3px',
      },
      [`&.${'ps-disabled'}`]: {
        color: themes[theme].menu.disabled.color,
      },
      '&:hover': {
        backgroundColor: '#9696fb',
        color: themes[theme].menu.hover.color,
        // borderRadius: '10px'
      },
    },
    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined,
    }),
  };

  return {
    toggle,
    menuItemStyles,
    hasImage,
  }
}
// hex to rgba converter
export const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};