import { SectionHeading } from "@/components/atoms/heading/heading";
import {
  Section1,
  section1Defaults,
} from "@/components/sections/signup/section1";
import {
  Section2,
  section2Defaults,
} from "@/components/sections/signup/section2";
import {
  Section3,
  section3Defaults,
} from "@/components/sections/signup/section3";
import { useTheme } from "@/theme/themeProvider";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";

export default function SignUp() {
  const index = Number(useLocalSearchParams().index);
  const { theme, setBackground } = useTheme();
  const [currentSection, setCurrentSection] = useState(index);
  const {
    control,
    trigger,
    getFieldState,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...section1Defaults,
      ...section2Defaults,
      ...section3Defaults,
    },
  });
  const sections = [
    <Section1
      trigger={trigger}
      getFieldState={getFieldState}
      errors={errors}
      setCurrentSection={setCurrentSection}
      control={control}
    />,
    <Section2
      trigger={trigger}
      getFieldState={getFieldState}
      errors={errors}
      setCurrentSection={setCurrentSection}
      control={control}
    />,
    <Section3
      trigger={trigger}
      handleSubmit={handleSubmit}
      getFieldValue={getValues}
      errors={errors}
      setCurrentSection={setCurrentSection}
      control={control}
    />,
  ];
  useEffect(() => {
    if (setBackground) {
      setBackground(theme ? theme.colors.secondary : "");
    }
  }, [theme]);

  const styles = StyleSheet.create({
    signUpContainer: {
      height: "100%",
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      padding: theme?.paddings.screen,
    },
    signUpSection: {
      padding: theme?.border.padding,
      gap: theme?.gaps.form,
      width: "100%",
    },
    fields: {
      alignItems: "flex-start",
      gap: theme?.gaps.form,
    },
  });

  return (
    <View style={styles.signUpContainer}>
      <KeyboardAvoidingView behavior="padding" style={styles.signUpSection}>
        <SectionHeading>Sign Up</SectionHeading>
        <View style={styles.fields}>
        {sections && sections[currentSection]}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
