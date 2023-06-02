import { Router } from "@/Router";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Provider } from "jotai";
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

export function App() {
  return (
    <Provider>
      <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </PersistQueryClientProvider>
    </Provider>
  );
}
