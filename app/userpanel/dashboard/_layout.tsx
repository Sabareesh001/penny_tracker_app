import { Slot, Stack } from "expo-router";

export default function Layout(){
    return(
        <Stack
        screenOptions={{
            headerShown:false,
            contentStyle:{
                backgroundColor:'transparent'
            }
        }}
        >
          <Stack.Screen name="userpanel/dashboard" />
          <Stack.Screen name="userpanel/dashboard/trackingDetails" />
        </Stack>
    )
}