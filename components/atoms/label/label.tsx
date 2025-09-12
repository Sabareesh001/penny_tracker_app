import { useTheme } from "@/theme/themeProvider";
import { ReactNode } from "react";
import { StyleSheet, Text } from "react-native";



const Label = ({children,required,error,centered,color}:{children:ReactNode,required?:boolean,error?:boolean,centered?:boolean,color?:string})=>{
     const {theme} = useTheme()
    const styles = StyleSheet.create({
        label:{
             color : color?color:theme?.colors.text,
             fontSize: theme?.text.section.label.fontSize
        },
        labelError:{
            color:theme?.colors.danger.danger
        },
        centered:{
            textAlign:'center'
        }
    })

    return(
        <>
    <Text  style={{...styles.label,...(error&&styles.labelError),...(centered && styles.centered)}}>
        {children}
        {
            required && <Text style={{color:theme?.colors.danger.danger}}>*</Text>
        }
    </Text>
        </>
)
}

export {Label}