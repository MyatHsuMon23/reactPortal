import {useContext} from 'react'
import { SidebarSelectedMenuTitleContext } from '../context'
import { CommonDataContext, SidebarParentMenuContext } from '@/context/context'

export const useSidebarSelectedMenuTitleContext = () => {
  return useContext(SidebarSelectedMenuTitleContext)
}

export const useSidebarParentMenuContext = () => {
  return useContext(SidebarParentMenuContext)
}

export const useCommonDataContext = () => {
  return useContext(CommonDataContext)
}