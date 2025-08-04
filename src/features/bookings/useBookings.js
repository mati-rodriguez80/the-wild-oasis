import { useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getBookings } from "../../services/apiBookings";
import { PAGE_SIZE } from "../../utils/constants";

export function useBookings() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // FILTER
  const filterValue = searchParams.get("status");
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue, method: "eq" };

  // SORT
  const sortByRaw = searchParams.get("sortBy") || "startDate-desc";
  const [field, direction] = sortByRaw.split("-");
  const sortBy = { field, direction };

  // PAGINATION
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  // QUERY
  // When getting the "data", it was necessary to define an empty object as default value since the data is
  // undefined first, so we were getting an error when trying to destructure `data` from it.
  const {
    data: { data: bookings, count } = {},
    isLoading,
    error,
  } = useQuery({
    // Here we can add any value that we want the query to depend on here onto this array. So now, we can add
    // the filter object, and whenever the filter changes, then React Query will re-fetch the data. So, we can
    // think of this as the dependency array of useQuery.
    queryKey: ["bookings", filter, sortBy, page],
    queryFn: () => getBookings({ filter, sortBy, page }),
  });

  // PRE-FETCHING
  // Pre-fetching is all about fetching some data that we know might become necessary before we actually need
  // that data to render it on the user interface. And, in the context of pagination usually that means that
  // we fetch the previous and next page before they are actually displayed.
  const totalPages = Math.ceil(count / PAGE_SIZE);
  if (page < totalPages)
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page + 1],
      queryFn: () => getBookings({ filter, sortBy, page: page + 1 }),
    });

  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page - 1],
      queryFn: () => getBookings({ filter, sortBy, page: page - 1 }),
    });

  return { bookings, isLoading, error, count };
}
