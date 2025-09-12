import { StyledTabs } from "@/components/wrappers/tabsRouterWrapper";
import { useTheme } from "@/theme/themeProvider";
import { TabRouter } from "@react-navigation/native";
import { Slot, Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";


export default function UserPanelLayout(){

    const {theme,setBackground} = useTheme();

    useEffect(()=>{
       setBackground && setBackground(theme?.colors.secondary || "")
    },[theme])

    const styles = StyleSheet.create({
        container:{
           height:'100%'
        }
    })

    return (
      <View style={styles.container}>
        <StyledTabs>
          <Tabs.Screen
            name={"dashboard"}
            options={{
              tabBarLabel: "Dashboard",
              headerTitle: "Dashboard",
              tabBarIcon: ({ color }) => (
                <FontAwesome size={28} name="dashboard" color={color} />
              ),
            }}
          />
            <Tabs.Screen
              name={"ledger/index"}
              options={{
                tabBarLabel: "Ledger",
                headerTitle: "Ledger",
                tabBarIcon: ({ color }) => (
                  <FontAwesome size={28} name="book" color={color} />
                ),
              }}
            />
          <Tabs.Screen
            name={"settings/index"}
            options={{
              tabBarLabel: "Settings",
              headerTitle: "Settings",
              tabBarIcon: ({ color }) => (
                <FontAwesome size={28} name="gears" color={color} />
              ),
            }}
          />
        </StyledTabs>
      </View>
    );
}