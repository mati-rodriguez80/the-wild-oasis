import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getBooking } from "../../services/apiBookings";

export function useBooking() {
  const { bookingId } = useParams(); // Get the bookingId from the URL parameters

  const {
    data: booking,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["booking"],
    queryFn: () => getBooking(bookingId),
    retry: false, // Disable retries for this query
  });

  return { booking, isLoading, error };
}
