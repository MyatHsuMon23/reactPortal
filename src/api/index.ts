import { AxiosRequestConfig } from 'axios'
import apiClient from './constant/apiClient'
import { cleanStorage, getItemFromStorage } from '../utils/auth'

export const AppController = async (
	reqUrl: string,
	payload?: any,
	baseURL: string = import.meta.env.VITE_APP_BASE_API_URL,
	header?: any,
	requireToken: boolean = true,
	accessToken?: any) => {

	let tmp = reqUrl.split(':')
	let bodyData = payload

	// Determine the token to be used based on the endpoint
	var authData = getItemFromStorage("auth");
	let token = ''
	token = authData?.accessToken

	const headers: AxiosRequestConfig['headers'] = {}

	if (requireToken) {
		headers['Authorization'] = `Bearer ${token}`
	}
	switch (header) {
		case "img":
			headers["responseType"] = "blob";
			break;
		case "multipart":
			headers["Content-Type"] = "multipart/form-data";
			break;
		case "urlencoded":
			headers['Content-Type'] = "application/x-www-form-urlencoded";
			break;
		default:
			headers["Content-Type"] = "application/json";
	}
	// headers['Access-Control-Allow-Origin']='*'

	return await apiClient({
		baseURL: baseURL,
		method: tmp[0],
		url: tmp[1],
		data: bodyData,
		headers: headers,
		responseType: header == 'img' ? 'blob' : 'json'
	})
		.then((res) => {
			res.headers['Access-Control-Allow-Origin'] = "*"
			if (res?.status === 401) {
				cleanStorage();
				window.location.href = "/"
			}
			return res
		})
		.catch((err) => {
			// console.log(err)
			if (err?.status === 401) {
				cleanStorage();
				window.location.href = "/"
			}
			return err
		})
}