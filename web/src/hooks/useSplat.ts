import { useLocation } from "react-router-dom";

export function useSplat(): string {
  const { pathname, search } = useLocation();

  return `${pathname}${search}`.slice(1);
}
