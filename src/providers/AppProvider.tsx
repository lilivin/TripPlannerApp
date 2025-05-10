import { Provider } from "react-redux";
import { store } from "@/store";
import { StrictMode } from "react";
import { QueryProvider } from "@/components/providers/QueryProvider";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <StrictMode>
      <Provider store={store}>
        <QueryProvider>{children}</QueryProvider>
      </Provider>
    </StrictMode>
  );
}
