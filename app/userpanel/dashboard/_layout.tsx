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