import React, { ImgHTMLAttributes, useState } from "react";
import { useFetchFile } from "@/api/hooks/useQueryHook";
import { endpoint } from "@/api/constant/endpoints";
import { useDispatch } from "react-redux";
import LinearProgress from '@mui/material/LinearProgress'

type ImgProps = ImgHTMLAttributes<any>;
const Img: React.FC<ImgProps> = ({ src, alt, style, ...props }) => {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);
	//extract query string from url
	// const qs = new URLSearchParams(src?.split("/")[1]).toString();
	const srcArr = src?.split("/") || [];
	const CaseNo = srcArr[srcArr.length - 2];
	const imageName = srcArr[srcArr.length - 1];

	//query string to object;
	// const queryObject = queryString.parse(qs);
	const styled = {
		display: loading? 'block': 'none',
		position: 'absolute',
		top: '50%',
		width:'50%',
		borderRadius: '25px',
		transform: 'translate(50%, 10px)'
	}

	const { data: file } = useFetchFile({
		queryKey: `${CaseNo}_${imageName}`,
		header: "img",
		url: `${endpoint.getImage}/${CaseNo}/${imageName}`,
	});
	return (
		<div style={{
			width: '100%',
			height: '100%',
			position: 'relative'
		}}>
			<img {...{ src: file, ...props }}
			onLoad={(e) => { setLoading(false) }} 
			width={'100%'} 
			height={'100%'}
			style={style}
			onClick={() => {
				dispatch({
					type: 'OPEN_ALERT_MODAL', payload: {
						title: alt,
						content: file
					}
				});
			}} />
			<LinearProgress sx={styled}/>
		</div>
	)
};
export default Img;