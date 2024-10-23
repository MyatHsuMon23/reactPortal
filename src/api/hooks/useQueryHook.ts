import { useMutation, useQuery } from '@tanstack/react-query'
import queryString from 'query-string'
import { isEmpty } from 'lodash'
import { AppController } from '..'
import { toBase64 } from '@/utils/common'

export const useQueryListData = ({ queryKey, url, config, payload, baseURL, ...query }: any) => {
	if (!isEmpty(query)) {
		const params = queryString.stringify(query, { encode: false });
		return useQuery(
			[queryKey, query],
			async () => await getAPIData(`${url}?${params}`, payload, baseURL),
			{
				...config,
				// staleTime: 1000 * 60 * 5, // data will be considered stale after 5 minutes 
				// cacheTime: 1000 * 60 * 10, // unused data will be garbage collected after 30 minutes
			}
		);
	}
	else {
		return useQuery(
			[queryKey, payload],
			async () => await getAPIData(`${url}`, payload, baseURL),
			{
				...config,
				// staleTime: 1000 * 60 * 5, // data will be considered stale after 5 minutes
				// cacheTime: 1000 * 60 * 10, // unused data will be garbage collected after 30 minutes
			}
		);
	}

}

export const getAPIData = async (url: string, payload: any, baseURL?: string, header?: string, requireToken?: boolean) => {
	return await AppController(url, payload, baseURL, header, requireToken)
		.then((res) => {
			return res
		})
		.catch((err) => {
			return err
		})
}

export function useMutateQuery() {
	return useMutation(
		({ url, body, baseURL }: any) =>
			AppController(url, body, baseURL)
				.then((res) => {
					return res
				})
				.catch((err) => {
					return err
				})
	);
}

export function useFetchFile({
	queryKey,
	url,
	header = "img",
	config,
	// ...queryObj
}: any) {
	// const params = new URLSearchParams(queryObj).toString();
	const response = useQuery(
		[queryKey],
		async () => await getAPIData(`${url}`, null, import.meta.env.VITE_APP_IMAGE_API, header, false).then(async ({ data }) => {
			// console.log(res)
			// var blobFile = new Blob([data], { type: "text/plain" })
			return await toBase64(data);
		}),
		config || {}
	);
	return { ...response, loading: response.isLoading };
}
