import { Section1 } from "@/components/sections/forgotPass/section1";
import { Section2 } from "@/components/sections/forgotPass/section2";
import { Section3 } from "@/components/sections/forgotPass/section3";
import { useTheme } from "@/theme/themeProvider";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";

export default function ForgotPassword() {
  const { theme, setBackground } = useTheme();
  const [email, setEmail] = useState("");
  const index = Number(useLocalSearchParams().index);
  const [currentSection, setCurrentSection] = useState(index);
  const sections = [
    <Section1 setCurrentSection={setCurrentSection} setEmail={setEmail} />,
    <Section2 setCurrentSection={setCurrentSection} email={email} />,
    <Section3 email={email}/>
  ];
  useEffect(() => {
    if (setBackground) {
      setBackground(theme ? theme.colors.secondary : "");
    }
  }, [theme]);

  const styles = StyleSheet.create({
    forgotPassContainer: {
      height: "100%",
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      padding: theme?.paddings.screen,
    },
    fieldContainer: {
      width: "100%",
      gap: theme?.gaps.form,
    },
  });

  return (
    <View style={styles.forgotPassContainer}>
      <KeyboardAvoidingView
        style={styles.fieldContainer}
        keyboardVerticalOffset={30}
        behavior="padding"
      >
        {sections[currentSection]}
      </KeyboardAvoidingView>
    </View>
  );
}
