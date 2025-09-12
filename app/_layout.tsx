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
import { FullPageLoaderProvider } from "@/store/pageContext";

export default function RootLayout() {

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
