import { useTheme } from "@/theme/themeProvider"
import { ReactNode } from "react"
import { StyleSheet, Text, TextProps } from "react-native"

const SectionHeading = (props:TextProps)=>{
    const {theme} = useTheme()
    const styles = StyleSheet.create({
        section:{
            textAlign:'center',
            fontSize:theme?.text.section.heading.fontSize,
            fontWeight:900,
            color:theme?.colors.text,
        }
    }) 
    return <Text {...props} style={[styles.section, props.style]}></Text>;
}

export {SectionHeading}