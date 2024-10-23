export const decorateTableProps = (data: any) => {
	if (!data?.data) {
		return {
			pagination: {
				pageSize: 15,
				totalItems: 0,
				totalPages: 0,
				currentPage: 1,
			},
		};
	}
	return {
		pagination: {
			pageSize: 15,
			totalItems: data.total,
			totalPages: Math.ceil(data.total / 15),
			currentPage: data.index? data.index + 1 : 1,
		},
	};
};