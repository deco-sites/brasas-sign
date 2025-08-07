import { MutableRefObject } from "https://esm.sh/v128/preact@10.19.6/compat/src/index.js";
import { useEffect } from "preact/hooks";

export const useClickOutsideListener = (
  elementRef: MutableRefObject<HTMLElement | null>,
  openerRef: MutableRefObject<HTMLElement | null>,
  setState: (state: boolean) => void,
) => {
  const closeOpenMenu = (e: MouseEvent) => {
    const targetNode = e.target as Node;
    if (
      openerRef?.current?.contains(targetNode) ||
      elementRef.current?.contains(targetNode)
    ) {
      return;
    }
    setState(false);
  };

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.addEventListener("mousedown", closeOpenMenu);

    return () => {
      document.removeEventListener("mousedown", closeOpenMenu);
    };
  }, [elementRef, openerRef]);
};
