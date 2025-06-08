import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface DataContextType {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataContextProviderProps {
  children: ReactNode;
}

export function DataContextProvider({
  children,
}: DataContextProviderProps): React.ReactElement {
  const [username, setUsername] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string | null>("");

  return (
    <DataContext.Provider
      value={{ username, setUsername, accessToken, setAccessToken }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useDataContext(): DataContextType {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataContextProvider");
  }
  return context;
}
