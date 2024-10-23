import React from "react";
import { useProSidebar } from "react-pro-sidebar";
import { MenuItemStyles } from "../types/SidebarTypes";
import { Theme, themes } from "../styles/CommonStyle";
import { useTheme } from "@mui/material";

export const useSubMenuSideBar = () => {
  const { collapseSidebar, toggleSidebar, collapsed, toggled, broken } = useProSidebar();
  const [theme, setTheme] = React.useState<Theme>('light');
  const globalTheme = useTheme();
  const [hasImage] = React.useState<boolean>(false);

  // // handle on theme change event
  // const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setTheme(e.target.checked ? 'dark' : 'light');
  // };

  // // handle on image change event
  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setHasImage(e.target.checked);
  // };

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
  const styled = {
    fontSize: '13px',
    fontWeight: 400,
    width: '100%',
    padding: '0px',
    height: '60px',
    border: '1px solid ghostwhite',
    '& .ps-menu-icon': {
      color: globalTheme.palette.primary.main,
      borderRadius: '50%',
      padding: '10px',
      '& svg': {
        fontSize: '20px !important',
      }
    }
  }

  const activeStyled = {
    background: '#6c6c6c',
    // borderRadius: '5px',
    transition: 'all .5s',
    color: globalTheme.palette.common.white,
    '& .ps-menu-icon.ps-active': {
      color: globalTheme.palette.common.white,
      borderRadius: '50%',
      padding: '10px',
      '& svg': {
        fontSize: '20px !important',
      }
    }
  }

  const menuItemStyles: MenuItemStyles = {
    root: styled,
    icon: {
      color: globalTheme.palette.primary.main,
      [`&.${'ps-disabled'}`]: {
        color: themes[theme].menu.disabled.color,
      },
    },
    SubMenuExpandIcon: {
      color: globalTheme.palette.common.blueColors.level1,
      paddingRight: '10px',
      '& span': {
        width: '7px',
        height: '7px'
      }
    },
    subMenuContent: ({ level }) => ({
      backgroundColor: themes[theme].menu.menuContent,
      '&.ps-open': {
        background: `${globalTheme.palette.success.light} !important`
      },
      '& .ps-menuitem-root': {
        // boxShadow: 'unset'
      }
    }),
    button: {
      [`&.${'ps-menu-button'}`]: {
        fontSize: '14px',
        height: '100%',
        padding: '5px',
        '& .ps-menu-icon': {
          marginRight: '0'
        },
        '& .ps-menu-label': {
          textWrap: 'wrap',
          paddingLeft: '5px'
        },
        '&.ps-active': activeStyled,
      },
      [`&.${'ps-disabled'}`]: {
        color: themes[theme].menu.disabled.color,
      },
      '&:hover': {
        backgroundColor: '#adadfb',
        color: globalTheme.palette.common.black,
        borderRadius: '10px',
        '& .ps-menu-icon': {
          color: globalTheme.palette.primary.main
        }
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