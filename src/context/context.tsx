import { ComponentClass, FC, ReactElement, createContext } from "react";
import { TemplateThemeModeContextType } from ".";
import { IRoute, Route } from "@/types/RouteType";

export const SidebarSelectedMenuTitleContext = createContext({menuItem: Route, setMenuItem: (mnuItem: any) => {}});

export const SidebarParentMenuContext = createContext({parentMenu: "", setParentMenu: (parentMenu: any) => {}});

export const TemplateDirectionContext = createContext({rtl: false, setRtl: (rtl: boolean) => {}});

export const CommonDataContext = createContext({isStillLoading: false, setStillLoading: (isStillLoading: boolean) => {}});

export const TemplateThemeModeContext = createContext<TemplateThemeModeContextType | null>(null);
