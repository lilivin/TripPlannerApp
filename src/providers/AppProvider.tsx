import { Provider } from "react-redux";
import { store } from "@/store";
import { StrictMode } from "react";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <StrictMode>
      <Provider store={store}>{children}</Provider>
    </StrictMode>
  );
}
