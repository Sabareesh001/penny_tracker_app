import { useTheme } from "@/theme/themeProvider";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { Image, StyleSheet } from "react-native";

type StyledTabsProps = React.ComponentProps<typeof Tabs>;

const StyledTabs = (props: StyledTabsProps) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    headerBackground: {
      flex: 1,
      borderBottomWidth: 0.5,
      borderColor:theme?.colors.text,
      justifyContent: "center",
      alignItems: "flex-end",
      padding: theme?.paddings.card,
    },
    qrScanIcon: {
      backgroundColor: theme?.colors.text,
      padding: 5,
      borderRadius: 10,
    },
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
