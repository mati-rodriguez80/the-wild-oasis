import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getBookings } from "../../services/apiBookings";

export function useBookings() {
  const [searchParams] = useSearchParams();

  // FILTER
  const filterValue = searchParams.get("status");
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue, method: "eq" };

  const {
    data: bookings,
    isLoading,
    error,
  } = useQuery({
    // Here we can add any value that we want the query to depend on here onto this array. So now, we can add
    // the filter object, and whenever the filter changes, then React Query will re-fetch the data. So, we can
    // think of this as the dependency array of useQuery.
    queryKey: ["bookings", filter],
    queryFn: () => getBookings({ filter }),
  });

  return { bookings, isLoading, error };
}
