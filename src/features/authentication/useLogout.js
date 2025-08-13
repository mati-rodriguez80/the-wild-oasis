import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { logout as logoutApi } from "../../services/apiAuth";

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      // Here we don't specify any key because we want to remove everything
      queryClient.removeQueries();
      navigate("/login", { replace: true });
    },
  });

  return { logout, isLoggingOut };
}
