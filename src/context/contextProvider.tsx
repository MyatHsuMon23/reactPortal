import { useState } from "react";
import {
    SidebarSelectedMenuTitleContext,
    SidebarParentMenuContext,
    TemplateDirectionContext,
    TemplateThemeModeContext,
    CommonDataContext
} from "./context";
import { Circle, HomeOutlined, TripOrigin } from '@mui/icons-material';

interface ContextProviderProps {
    children: React.ReactNode
}

export const ContextProvider = ({ children }: ContextProviderProps) => {
    const [isDark, setIsDark] = useState<boolean>(true);
    const toggleThemeMode = () => {
        setIsDark(!isDark)
    }

    const [rtl, setRtl] = useState<boolean>(false);
    const [menuItem, setMenuItem] = useState({
        key: import.meta.env.VITE_APP_DEFAULT_MENUITEM,
        title: import.meta.env.VITE_APP_DEFAULT_MENUTITLE,
        path: '/',
        enabled: true,
        icon: <Circle style={{ fontSize: '10px !important' }} />
    });
    const [parentMenu, setParentMenu] = useState(import.meta.env.VITE_APP_DEFAULT_PARENT_ID);
    const [isStillLoading, setStillLoading] = useState(false);
    return (
        <TemplateThemeModeContext.Provider value={{ isDark, toggleThemeMode }}>
            <TemplateDirectionContext.Provider value={{ rtl, setRtl }}>
                <SidebarParentMenuContext.Provider value={{ parentMenu, setParentMenu }}>
                    <SidebarSelectedMenuTitleContext.Provider value={{ menuItem, setMenuItem }}>
                        <CommonDataContext.Provider value={{ isStillLoading, setStillLoading }}>
                            {children}
                        </CommonDataContext.Provider>
                    </SidebarSelectedMenuTitleContext.Provider>
                </SidebarParentMenuContext.Provider>
            </TemplateDirectionContext.Provider>
        </TemplateThemeModeContext.Provider>
    );
};