import { ComponentClass, FC, ReactElement } from "react";

export interface IRoute {
    key: string,
    title: string,
    path: string,
    enabled: boolean,
    component: ComponentClass | FC
    icon?: ReactElement;
    subMenus: Array<any>
}
export interface IAllRoute {
    key: string,
    path: string,
    enabled: boolean,
    component: ComponentClass | FC
}

export const Route = {
    key: '',
    title: '',
    path: '',
    enabled: false,
    icon: <></>
}
