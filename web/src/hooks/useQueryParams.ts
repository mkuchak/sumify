import { useLocation } from "react-router-dom";

export function useQueryParams<T extends object = any>(): T {
  const params = new URLSearchParams(useLocation().search);

  const data: { [key: string]: any } = {};

  for (const key of params.keys()) {
    data[key] = params.get(key);
  }

  return data as T;
}
