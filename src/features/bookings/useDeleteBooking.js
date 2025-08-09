import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteBooking as deleteBookingApi } from "../../services/apiBookings";

export function useDeleteBooking() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteBooking } = useMutation({
    mutationFn: deleteBookingApi,
    onSuccess: () => {
      toast.success("Booking successfully deleted");
      // We invalidate the query so it can refetch again
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });
    },
    // The error thrown here comes from the mutationFn
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteBooking };
}
