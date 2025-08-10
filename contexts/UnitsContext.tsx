import { createContext } from "preact";
import { useContext } from "preact/hooks";

export interface Unit {
  id: number;
  name: string;
  nickname: string;
  internal_name: string;
}

interface UnitsContextType {
  units: Unit[];
}

const UnitsContext = createContext<UnitsContextType>({ units: [] });

export const UnitsProvider = (
  { units, children }: { units: Unit[]; children: preact.ComponentChildren },
) => {
  return (
    <UnitsContext.Provider value={{ units }}>
      {children}
    </UnitsContext.Provider>
  );
};

export const useUnits = () => useContext(UnitsContext);
