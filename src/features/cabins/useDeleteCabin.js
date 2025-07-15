import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteCabin as deleteCabinApi } from "../../services/apiCabins";

export function useDeleteCabin() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteCabin } = useMutation({
    // mutationFn: (id) => deleteCabin(id),
    mutationFn: deleteCabinApi,
    onSuccess: () => {
      toast.success("Cabin successfully deleted");
      // We invalidate the query so it can refetch again
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },
    // The error thrown here comes from the mutationFn
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteCabin };
}
