import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";

const LoginContext = createContext<{
  loggedIn: boolean;
  setLoggedIn?: React.Dispatch<React.SetStateAction<boolean>>;
}>({ loggedIn: false });

const LoginContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(SecureStore.getItem("authToken") != null);
  }, []);



  return (
    <LoginContext.Provider value={{ loggedIn, setLoggedIn }}>
      {children}
    </LoginContext.Provider>
  );
};

const useLoginCtx = () => {
  return useContext(LoginContext);
};

export { LoginContextProvider, useLoginCtx };
