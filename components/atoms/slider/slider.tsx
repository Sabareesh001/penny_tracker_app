import { useTheme } from "@/theme/themeProvider"
import { Slider, SliderProps } from "@expo/ui/jetpack-compose"

const StyledSlider = (props:SliderProps)=>{
    const {theme} = useTheme();
    return(
        <Slider elementColors={{
            thumbColor:theme?.colors.primary,
            activeTrackColor:theme?.colors.primary,
            inactiveTrackColor:theme?.border.color,
        }} {...props} />
    )
}

export {StyledSlider}