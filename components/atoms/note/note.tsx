import { useTheme } from "@/theme/themeProvider";
import { StyleSheet, Text, TextProps } from "react-native"

const Note = (props:TextProps&{error?:boolean})=>{

    const {theme} =  useTheme();

    const styles = StyleSheet.create({
        error:{
          color:theme?.colors.danger.danger,
        },
        note:{
            color:theme?.colors.primary,
            fontSize:theme?.text.note.fontSize
        }
    })

    return(
        <Text style={{...styles.note, ...(props?.error && styles.error)}} {...props}/>
    )
}

export {Note};