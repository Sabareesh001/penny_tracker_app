import { useTheme } from "@/theme/themeProvider"
import { Picker, PickerProps } from "@expo/ui/jetpack-compose"
import { StyleSheet, View } from "react-native"

const StyledPicker = (props:PickerProps)=>{

    const {theme} =useTheme()

    return(
        <View style={{width:100}}>
            <Picker
            color={theme?.colors.primary}
            elementColors={{
                activeBorderColor:theme?.colors.primary,
                activeContentColor:theme?.colors.secondary,
                activeContainerColor:theme?.colors.primary,
                inactiveBorderColor:theme?.border.color,
                inactiveContainerColor:'transparent'
            }}
            {...props}
            />
        </View>
    )
}

export {StyledPicker}