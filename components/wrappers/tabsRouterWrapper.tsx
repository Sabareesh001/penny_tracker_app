import { usePreferenceContext } from "@/store/currencyContext";
import { useTheme } from "@/theme/themeProvider";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router, Tabs } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { Image, StyleSheet } from "react-native";
import CountryFlag from "react-native-country-flag";

type StyledTabsProps = React.ComponentProps<typeof Tabs>;

const StyledTabs = (props: StyledTabsProps) => {
  const { theme } = useTheme();
  const {country} = usePreferenceContext();
  const styles = StyleSheet.create({
    headerBackground: {
      flex: 1,
      borderBottomWidth: 0.5,
      borderColor:theme?.colors.text,
      justifyContent: "flex-end",
      alignItems: "center",
      gap:theme?.gaps.form,
      flexDirection:"row",
      padding: theme?.paddings.card,
    },
    qrScanIcon: {
      backgroundColor: theme?.colors.text,
      padding: 5,
      borderRadius: 10,
    },
    countryFlagStyle: {
      borderRadius:100
    }
  });

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme?.colors.secondary,
        },
        tabBarActiveTintColor: theme?.colors.primary,
        tabBarInactiveTintColor: theme?.colors.primaryDisabled,
        headerStyle: {
          backgroundColor: theme?.colors.secondary,
          borderBottomWidth: 0.5,
          shadowColor: theme?.border.color,
        },
        headerBackground: () => (
          <View
            
            style={styles.headerBackground}
          >
            <Pressable onPress={()=>{router.push("/userpanel/settings")}}>
            <CountryFlag  style={StyleSheet.create({borderRadius:theme?.border.radius})} key={country} isoCode={country} size={28} />
            </Pressable>
            <Pressable
             style={styles.qrScanIcon}
            >
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={24}
                color={theme?.colors.neutral2}
              />
            </Pressable>
          </View>
        ),
        headerStatusBarHeight: 0,
        headerTitleStyle: {
          color: theme?.colors.text,
        },
        sceneStyle: {
          backgroundColor: "transparent",
        },
      }}
      {...props}
    />
  );
};

export { StyledTabs };
