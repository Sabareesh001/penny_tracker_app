import React, { useRef, useEffect } from "react";
import { Animated, StyleSheet, View } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useTheme } from "@/theme/themeProvider";

const LiveIcon = () => {
  const { theme } = useTheme();
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1200,
              delay:800,
              useNativeDriver: true,
            }),
      ])
    ).start();
  }, []);

  const color = theme?.colors.danger.danger;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.pulse,
          {
            backgroundColor: color,
            transform: [{ scale: pulseAnim }],
              opacity: pulseAnim.interpolate({
                inputRange: [0.5, 1],
                outputRange: [0.5, 0],
              }),
          },
        ]}
      />
      <FontAwesome5
        name="dot-circle"
        size={16}
        color={color}
        style={styles.icon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  pulse: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  icon: {
    zIndex: 1,
  },
});

export { LiveIcon };
