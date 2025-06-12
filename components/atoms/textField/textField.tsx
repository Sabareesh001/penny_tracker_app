import { useTheme } from "@/theme/themeProvider";
import { StyleSheet, TextInput } from "react-native";

const TextField = (props:any)=>{
    const {theme} = useTheme()
    const styles = StyleSheet.create({
        textInput:{
            borderWidth:theme?.border.borderWidth,
            borderColor:theme?.border.color,
            padding:theme?.border.padding,
            borderRadius:theme?.border.radius,
            color:theme?.colors.input,
            fontSize: theme?.text.section.label.fontSize
        }
    })
    return(
        <TextInput {...props}  style={styles.textInput}>
        </TextInput>
    )
}

export {TextField}