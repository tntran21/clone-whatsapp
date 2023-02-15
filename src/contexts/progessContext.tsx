import { createContext, ReactNode, useState } from "react";

export interface ProgressContextProviderProps {
  children: ReactNode;
}

interface State {
  lastTime: string;
  toggleDate: (data: string) => void;
}

const stateDefault = {
  lastTime: "2012/12/12",
  toggleDate: () => {},
};

export const ProgessContext = createContext<State>(stateDefault);

const ProgessContextProvider = ({ children }: ProgressContextProviderProps) => {
  const [progess, setProgess] = useState(stateDefault);

  const toggleDate = (data: string) => {
    setProgess({ ...progess, lastTime: data });
  };

  const progessDynamic = { ...progess, toggleDate };

  return (
    <ProgessContext.Provider value={progessDynamic}>
      {children}
    </ProgessContext.Provider>
  );
};

export default ProgessContextProvider;
