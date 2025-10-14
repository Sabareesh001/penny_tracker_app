import { useTheme } from "@/theme/themeProvider";
import { Slot, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function Layout() {
  const { theme } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme?.colors.secondary,
          padding: 16,
        },
      }}
    >
      <Stack.Screen name="userpanel/dashboard" />
      <Stack.Screen options={{
        presentation: "containedModal",
        animation:"flip"
      }} name="userpanel/dashboard/trackingDetails" />
      <Stack.Screen
        options={{
          presentation: "transparentModal",
          animation: "flip",
          contentStyle: {
            backgroundColor: "transparent", // only for this modal
          },
        }}
        name="userpanel/dashboard/addTracking"
      />
    </Stack>
  );
}