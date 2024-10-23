import React, { FC, ReactElement, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Outlet } from 'react-router-dom';

import { IAllRoute, IRoute } from "../types/RouteType";
import { authRoutes, routes } from "./index";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import { RootState } from '../redux/store/store';
import { getItemFromStorage } from "../utils/auth";
import { useSidebarSelectedMenuTitleContext } from "@/hooks";
import { Circle } from "@mui/icons-material";
import { useSidebarParentMenuContext } from "@/hooks/useSidebarSelectedMenuTitleContext";
import { checkControlsByRole } from "@/utils/roleAccess";
import { AdminRoles } from "@/utils/commonData";

const ModifiedMainLayout = () => {
    return (
        <MainLayout>
            <Outlet />
        </MainLayout>
    )
};

const ModifiedAuthLayout = () => {
    return (
        <AuthLayout>
            <Outlet />
        </AuthLayout>
    )
};

const AppRoutes: FC = () => {
    const { menuItem, setMenuItem } = useSidebarSelectedMenuTitleContext();
    const { setParentMenu } = useSidebarParentMenuContext();
    const currentRoute = window.location.pathname

    const navigate = useNavigate();
    const { auth } = useSelector((state: RootState) => state.auth);
    const authData = getItemFromStorage("auth");
    // const filter_Routes = dashboardRoutes.filter((route: IRoute) => route.roles?.includes(authData?.Role || auth.Role));

    var otherRoutes:any = [];
    if(AdminRoles.includes(authData?.Role)){
      otherRoutes = routes;
    }
    else {
      otherRoutes = routes.filter((x: any) => x.key !== 'admin');
    }

    const isAuthenticated = authData?.accessToken || auth.accessToken;
    const menuItemUpdate = (key: string, title: string, path: string, enable: boolean, icon: ReactElement) => {
        return {
            key: key,
            title: title,
            path: path,
            enable: enable,
            icon: icon
        }
    }

    const checkRoute = (route: any) => {
        return currentRoute === `/${route}`
    }

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        }
        routes.forEach(route => {
            route.subMenus.forEach(subRoute => {
                if (checkRoute(subRoute.key)) {
                    setParentMenu(route.key);
                    setMenuItem(menuItemUpdate(subRoute.key, subRoute.title, subRoute.path, true, <Circle />));
                }
            })
        });
    }, [isAuthenticated, navigate])

    return (
        <>
            {isAuthenticated ?
                <Routes>
                    <Route element={<ModifiedMainLayout />}>
                        {otherRoutes.map((route: IRoute) => {
                            return route.subMenus.map((subRoute: IRoute) => (
                                <Route
                                    key={subRoute.key}
                                    path={subRoute.path}
                                    element={<subRoute.component />}
                                />
                            ))
                        })
                        }
                    </Route>
                </Routes>
                :
                <React.Fragment>
                    <Routes>
                        <Route element={<ModifiedAuthLayout />}>
                            {authRoutes.map((route: IRoute) => (
                                <Route
                                    key={route.key}
                                    path={route.path}
                                    element={<route.component />}
                                />
                            ))}
                        </Route>
                    </Routes>
                </React.Fragment>
            }
        </>
    )
}

export default AppRoutes;