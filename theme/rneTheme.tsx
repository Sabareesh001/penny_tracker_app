import { createTheme, CreateThemeOptions } from "@rneui/themed";
import { useTheme } from "./themeProvider";
import { View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
const getRneTheme = ():CreateThemeOptions=>{

    const {theme} = useTheme();

    console.log(theme?.colors.primary)

    const rneTheme = createTheme({
      lightColors: {
        primary: theme?.colors.primary,
        secondary: theme?.colors.secondary,
      },
      darkColors: {
        primary: theme?.colors.primary,
        secondary: theme?.colors.secondary,
      },

      components: {
        Skeleton: {
          animation: "wave",
          skeletonStyle: {
            borderRadius: theme?.border.radius,
            backgroundColor: theme?.colors.neutral,
            flex: 1,
          },
          style: {
            borderRadius: theme?.border.radius,
            backgroundColor: theme?.colors.neutral2,
            flex: 1,
          },
        },
        Button: {
          raised: true,
          titleStyle: {
            color: theme?.colors.text,
          },
        },
        Tab: {
          titleStyle(active) {
            return {
              color: active
                ? theme?.colors.text
                : theme?.colors.primaryDisabled,
            };
          },
          indicatorStyle: {
            backgroundColor: theme?.colors.primary,
          },
          style: {
            borderWidth: theme?.border.borderWidth,
            borderColor: theme?.colors.primary,
            borderRadius: theme?.border.radius,
            backgroundColor: theme?.colors.neutral2,
          },

          buttonStyle(active) {
            return {
              backgroundColor: active
                ? theme?.colors.primary
                : theme?.colors.neutral2,
              padding: 0,
              borderRadius: theme?.border.radius,
            };
          },
        },
        CheckBox: {
          containerStyle: {
            margin: 0,
            backgroundColor: "transparent",
            padding: 0,
          },
          wrapperStyle: {
            backgroundColor: theme?.colors.secondary,
            borderRadius: theme?.border.radius,
            borderColor: theme?.border.color,
            borderWidth: theme?.border.borderWidth,
            paddingLeft: 5,
            paddingTop: 3,
            paddingBottom: 3,
          },

          center: true,
          size: 24,
        },
        Card: {
          containerStyle: {
            backgroundColor: theme?.colors.neutral,
            margin: 0,
            borderRadius: theme?.border.radius,
          },
        },
        Text: {
          style: {
            color: theme?.colors.text,
          },
        },
      },
    });

    return rneTheme;
}

export {getRneTheme};
