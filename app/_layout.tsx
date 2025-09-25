import { ToastStyled } from "@/components/atoms/toast/toast";
import SafeViewWrapper from "@/components/wrappers/safeViewWrapper";
import { ThemeProvider } from "@/theme/themeProvider";
import { Redirect, Slot, Stack } from "expo-router";
import { View } from "react-native";
import { useLoginCtx } from "@/store/loginContext";
import axios from "axios";
import { navigate } from "expo-router/build/global-state/routing";
import { useEffect } from "react";
import { LoginContextProvider } from "@/store/loginContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FullPageLoader } from "@/components/atoms/loader";
import { FullPageLoaderProvider, getFullPageLoader } from "@/store/pageContext";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";
export default function RootLayout() {

    const { loggedIn, setLoggedIn } = useLoginCtx();

    const {fullPageLoaderOpen,setFullPageLoaderOpen} = getFullPageLoader();

  useEffect(()=>{
    
    const resInterceptor = axios.interceptors.response.use(
    config => config,
    async (error) => {
      if(error.code === "ECONNABORTED" || !error.response){
        Toast.show({
          type:"info",
          text1:"Network Error"
        })
  
        setFullPageLoaderOpen && setFullPageLoaderOpen(false);

      }
      else if (error.response?.status === 401) {   
        await SecureStore.deleteItemAsync("authToken");
        setLoggedIn && setLoggedIn(false);
        navigate("/login");
      }
      console.log(error)
      return Promise.reject(error);
    }
  );

  const reqInterceptor = axios.interceptors.request.use(
    async (config) => {
      const token = await SecureStore.getItemAsync("authToken");
      config.timeout = 10000;
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  return () => {
    axios.interceptors.request.eject(reqInterceptor);
    axios.interceptors.response.eject(resInterceptor);
  };
}, []);

  useEffect(()=>{
    (async()=>{
      if(! await AsyncStorage.getItem("currency")){
        await AsyncStorage.setItem("currency", "USD-United States");
      }
      if(! await AsyncStorage.getItem("weightMeasure")){
        await AsyncStorage.setItem("weightMeasure", "gram");
      }
    })()
  },[])

  return (
    <LoginContextProvider>
      <ThemeProvider>
        <FullPageLoaderProvider>
          <FullPageLoader/>
        <SafeViewWrapper>
          <View style={{ zIndex: 1 }}>
            <ToastStyled />
          </View>
          <Slot />
        </SafeViewWrapper>
        </FullPageLoaderProvider>
      </ThemeProvider>
    </LoginContextProvider>
  );
  
}