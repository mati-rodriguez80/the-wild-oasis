import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { login as loginApi } from "../../services/apiAuth";

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: login, isPending: isLogging } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: (data) => {
      // Once we logged in, then the user is being redirected to the dashboard where we are getting the user again
      // in the ProtectedRoute. In order to avoid this re-fetched and the display of the spinner in that situation,
      // React Query could simple get this data from the cache if we put it there inmediately after login in.
      // This way the login will be a little bit quicker. So, we take the newly logged in user and manually add them
      // to the React Query cache, and then in the useUser hook used by ProtectedRoute that uses the same queryKey
      // will allow React Query to take the user from the cache.
      queryClient.setQueriesData(["user"], data.user);
      navigate("/dashboard");
    },
    onError: (error) => {
      console.log("ERROR", error);
      toast.error("Provided email or password are incorrect");
    },
  });

  return { login, isLogging };
}
