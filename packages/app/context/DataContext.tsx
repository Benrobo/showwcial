import { createContext, useEffect, useState } from "react";

const DataContext = createContext<ProviderTypes>(null);

export default DataContext;

type ProviderTypes = {
  isOauthWindowOpened: boolean;
  setIsOauthWindowOpened: (value: boolean) => void;
  userInfo: any;
};

export function DataContextProvider({ children }) {
  const [isOauthWindowOpened, setIsOauthWindowOpened] = useState(false);
  const [userInfo, setUserInfo] = useState<any>({});

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userData"));
    setUserInfo(userInfo);
  }, []);

  const contextValues: ProviderTypes = {
    isOauthWindowOpened,
    setIsOauthWindowOpened,
    userInfo,
  };

  return (
    <DataContext.Provider value={contextValues}>
      {children}
    </DataContext.Provider>
  );
}
