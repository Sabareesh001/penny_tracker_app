import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";
import {jwtDecode, JwtPayload} from "jwt-decode"
const LoginContext = createContext<{
  loggedIn: boolean;
  setLoggedIn?: React.Dispatch<React.SetStateAction<boolean>>;
  userFirstName: string;
  setUserFirstName?: React.Dispatch<React.SetStateAction<string>>;
}>({ loggedIn: false, userFirstName: "User" });

const LoginContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userFirstName,setUserFirstName] = useState("User")
  useEffect(() => {
    setLoggedIn(SecureStore.getItem("authToken") != null);
  }, []);

  useEffect(() => {
    if (loggedIn) {
      const token = SecureStore.getItem("authToken");
      if (token) {
        const decoding:JwtPayload & {userId:number,userName:string} = jwtDecode(token);
        setUserFirstName(decoding?.userName)
      }
      
    }
  },[loggedIn])



  return (
    <LoginContext.Provider value={{ loggedIn, setLoggedIn ,setUserFirstName,userFirstName}}>
      {children}
    </LoginContext.Provider>
  );
};

const useLoginCtx = () => {
  return useContext(LoginContext);
};

export { LoginContextProvider, useLoginCtx };
