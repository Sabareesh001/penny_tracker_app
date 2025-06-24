import { ToastStyled } from "@/components/atoms/toast/toast";
import SafeViewWrapper from "@/components/wrappers/safeViewWrapper";
import { ThemeProvider } from "@/theme/themeProvider";
import { Slot, Stack } from "expo-router";
import { View } from "react-native";

export default function RootLayout() {
  return (
  <ThemeProvider>
    <SafeViewWrapper>
      <View style={{zIndex:1}}>
    <ToastStyled/>
      </View>
      <Slot/>
    </SafeViewWrapper>
  </ThemeProvider>
  );
  
}
