import { ToastStyled } from "@/components/atoms/toast/toast";
import SafeViewWrapper from "@/components/wrappers/safeViewWrapper";
import { ThemeProvider } from "@/theme/themeProvider";
import { Slot, Stack } from "expo-router";

export default function RootLayout() {
  return (
  <ThemeProvider>
    <SafeViewWrapper>
    <ToastStyled/>
      <Slot/>
    </SafeViewWrapper>
  </ThemeProvider>
  );
  
}
