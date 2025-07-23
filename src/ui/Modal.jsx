import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";

import styled from "styled-components";

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    /* Sometimes we need both */
    /* fill: var(--color-grey-500);
    stroke: var(--color-grey-500); */
    color: var(--color-grey-500);
  }
`;

const ModalContext = createContext();

function Modal({ children }) {
  const [openName, setOpenName] = useState("");

  const close = () => setOpenName("");
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, close, open }}>{children}</ModalContext.Provider>
  );
}

function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);

  // cloneElement lets you create a new React element using another element as a starting point
  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

function Window({ children, name }) {
  const { openName, close } = useContext(ModalContext);

  // This guard clause is for when we have two Windows within a unique Modal component, so then one of the two windows
  // will then have the name equal to cabin-form or table, for instance.
  if (name !== openName) return null;

  // A React Portal is a feature that essentially allow us to render an element "outside of the parent's component
  // DOM Structure" while still keeping the elements in "the original position of the Component Tree". In other words,
  // with a Portal we can basically render a component in any place that we want inside the DOM tree but still
  // leave the component at the same place in the React component tree, and so then things like props keep working
  // normally. And so, this is great and generally used for all elements that we want to stay on top of other elements
  // like modals windows, tooltips, menus, and so on. We implement this by using createPortal which needs the JSX first,
  // and then the parent DOM element.

  return createPortal(
    <Overlay>
      <StyledModal>
        <Button onClick={close}>
          <HiXMark />
        </Button>

        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </StyledModal>
    </Overlay>,
    document.body
  );

  // Now, we might be wondering, this already works great without the Portal and with just regular CSS positioning,
  // so why we even need to use this Portal? The main reason why a Portal becomes necessary is in order to avoid
  // conflicts with the CSS property "overflow: hidden". Many times we build a component like a modal and it works
  // just fine, but then some other developer will re-use it somewhere else, and that might be a place where the modal
  // will get cut off by an overflow hidden set on the parent. So, this is basically all about reusability, and in
  // order to avoid these situations will simply render the modal completely outside the rest of the DOM.
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
