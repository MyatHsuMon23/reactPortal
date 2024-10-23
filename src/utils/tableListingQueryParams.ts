import { useLocation } from "react-router-dom";
import queryString from "query-string";

// get params for listing view from query string
export function useListingQueryParams() {
  const { search } = useLocation();
  const {
    index,
    size,
    // sortBy,
    // isDesc,
    startDate,
    endDate,
  } = queryString.parse(search);


  return {
    ...(index && { index }),
    ...(size && { size }),
    // ...(sortBy && { sortBy }),
    // ...(isDesc && { isDesc }),
    ...(startDate && {startDate}),
    ...(endDate && {endDate}),
  };
}