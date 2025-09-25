import { useTheme } from "@/theme/themeProvider";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

type StyledTabsProps = React.ComponentProps<typeof Tabs>;

const StyledTabs = (props:StyledTabsProps) => {

  const {theme} = useTheme();

  const styles = StyleSheet.create({

  })

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme?.colors.secondary,
          borderColor: theme?.border.color,
        },
        tabBarActiveTintColor:theme?.colors.primary,
        tabBarInactiveTintColor:theme?.colors.primaryDisabled,
        tabBarLabelStyle: {
          color: theme?.colors.text,
        },
        headerStyle: {
          backgroundColor: theme?.colors.secondary,
          borderColor: theme?.border.color,
          borderBottomWidth:0.5,
          shadowColor:theme?.border.color
        },
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
