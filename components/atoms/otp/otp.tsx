import { useTheme } from "@/theme/themeProvider"
import { StyleSheet } from "react-native";
import { OtpInput, OtpInputProps } from "react-native-otp-entry"

const OtpInputStyled = (props:OtpInputProps)=>{
    const {theme} = useTheme();

    const styles = StyleSheet.create({
      pinCodeContainerStyle: {
        borderColor: theme?.colors.primaryDisabled,
    },
    pinCodeTextStyle:{
        color: theme?.colors.primary
    },
    focusedPinCodeContainerStyle:{
          borderColor: theme?.colors.primary,
      },
    containerStyle:{
        justifyContent:'space-around',
    }
    });

    return (
      <OtpInput
        theme={{
          containerStyle:styles.containerStyle,
          pinCodeContainerStyle: styles.pinCodeContainerStyle,
          pinCodeTextStyle: styles.pinCodeTextStyle,
          focusedPinCodeContainerStyle:styles.focusedPinCodeContainerStyle
        }}
        {...props}
      />
    );
}

export {OtpInputStyled}