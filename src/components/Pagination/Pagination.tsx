import React from "react";
import ReactPaginate from "react-paginate";

import "./Pagination.css";
import { Box } from "@mui/material";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

interface Props {
	totalPages: number;
	onChange?: (val: number) => void;
	currentPage: number;
}

const Pagination: React.FC<Props> = ({
	currentPage,
	totalPages,
	onChange = () => {},
}) => {
	function handlePageChange({ selected }: any) {
		onChange(selected + 1);
	}

	return (
			<Box>
				<ReactPaginate
					previousLabel={
						<KeyboardDoubleArrowRightIcon />
					}
					previousClassName="page-nav"
					previousLinkClassName="prev-page-link"
					nextLabel={
						<KeyboardDoubleArrowRightIcon/>
					}
					nextClassName="page-nav"
					nextLinkClassName="next-page-link"
					pageCount={totalPages}
					marginPagesDisplayed={2}
					forcePage={currentPage - 1}
					pageRangeDisplayed={5}
					onPageChange={handlePageChange}
					containerClassName={"pagination"}
					pageClassName={"page-item"}
					pageLinkClassName={"page-link"}
					activeClassName="active"
					breakClassName="page-item"
					breakLinkClassName="page-link"
				/>
			</Box>
	);
};

export default Pagination;
