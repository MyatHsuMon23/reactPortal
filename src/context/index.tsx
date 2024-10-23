import { 
    SidebarSelectedMenuTitleContext, 
    TemplateDirectionContext,
    TemplateThemeModeContext,
    CommonDataContext
 } from './context';
import { ContextProvider } from './contextProvider';

export interface TemplateThemeModeContextType {
    isDark: boolean;
    toggleThemeMode: () => void;
}
export { 
    SidebarSelectedMenuTitleContext, 
    TemplateDirectionContext, 
    TemplateThemeModeContext,
    CommonDataContext, 
    ContextProvider 
}