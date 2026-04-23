import { createContext, useContext, useState } from "react";

interface DemoModeContextValue {
  demoMode: boolean;
  setDemoMode: (v: boolean) => void;
}

const DemoModeContext = createContext<DemoModeContextValue>({
  demoMode: false,
  setDemoMode: () => {},
});

export function DemoModeProvider({ children }: { children: React.ReactNode }) {
  const [demoMode, setDemoMode] = useState(true);
  return (
    <DemoModeContext.Provider value={{ demoMode, setDemoMode }}>
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode() {
  return useContext(DemoModeContext);
}
