import { useTheme } from "@/theme/themeProvider";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

const TextField = (props:TextInputProps & {error?:boolean})=>{
    const {theme} = useTheme()
    const styles = StyleSheet.create({
        textInput:{
            borderWidth:theme?.border.borderWidth,
            borderColor:theme?.border.color,
            padding:theme?.border.padding,
            borderRadius:theme?.border.radius,
            color:theme?.colors.input,
            fontSize: theme?.text.section.label.fontSize,
        },
        textInputError:{
             borderColor:theme?.colors.danger.danger,
        }
    })
    return(
        <TextInput {...props}  style={{...styles.textInput,...(props?.error && styles.textInputError)}}>
        </TextInput>
    )
}

export {TextField}