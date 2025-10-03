import { useTheme } from "@/theme/themeProvider";
import { Slot, Stack } from "expo-router";
import { View } from "react-native";

export default function Layout() {
  const { theme } = useTheme();
  return(
    <Stack
        screenOptions={{
          headerShown:false,
            contentStyle:{
              backgroundColor:'transparent',
              padding: 16,
            },
        }}
        
        >
          <Stack.Screen name="userpanel/dashboard" />
          <Stack.Screen name="userpanel/dashboard/trackingDetails" />
          <Stack.Screen options={{
            presentation:'transparentModal',
            animation:'fade',
            contentStyle: {
            backgroundColor: "transparent",  // only for this modal
          },
          }} name="userpanel/dashboard/addTracking" />
        </Stack>
    )
}