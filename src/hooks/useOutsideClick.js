import { useEffect, useRef } from "react";

export function useOutsideClick(handler, listenCapturing = true) {
  const ref = useRef();

  useEffect(
    function () {
      function handleClick(e) {
        if (ref.current && !ref.current.contains(e.target)) {
          // If the click is outside the modal window, close it
          handler();
        }
        // This is important to avoid closing the modal when clicking inside it. We use the ref to check if the click is
        // inside the modal window, and if it is, we simply return and do nothing.
      }

      // We use the "true" argument to make sure that the event is captured in the capturing phase, so as the event moves
      // down the DOM tree, which means that the event will be handled before it reaches the modal window. This way, we
      // can check if the click is outside the modal window and close it if it is.
      document.addEventListener("click", handleClick, listenCapturing);

      // We return a cleanup function to remove the event listener when the component unmounts, which is important to
      // avoid memory leaks and ensure that the event listener is not left hanging around after the component
      // is no longer needed.
      return () => document.removeEventListener("click", handleClick, listenCapturing);
    },
    [handler, listenCapturing]
  );

  return ref;
}
