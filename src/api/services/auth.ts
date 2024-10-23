import { AppController } from ".."
import { endpoint } from "../constant/endpoints"

export const postTokenGenerate = async (formData: any) => {
  return await AppController(`${endpoint.getToken}`, formData, import.meta.env.VITE_APP_TOKEN_API_URL, "urlencoded", false)
    .then((res) => {
      return res
    })
    .catch((err) => {
      return err
    })
}


export const postApiLogin = async (formData: any) => {
  return await AppController(`${endpoint.postApiLogin}`, formData, import.meta.env.VITE_APP_AUTH_API_URL, false)
    .then((res) => {
      return res
    })
    .catch((err) => {
      return err
    })
}