import { useTheme } from "@/theme/themeProvider"
import { ReactNode } from "react"
import { StyleSheet, Text } from "react-native"

const SectionHeading = ({children}:{children:ReactNode})=>{
    const {theme} = useTheme()
    const styles = StyleSheet.create({
        section:{
            textAlign:'center',
            fontSize:theme?.text.section.heading.fontSize,
            fontWeight:900,
            color:theme?.colors.text
        }
    }) 
    return(
        <Text style={styles.section}>
            {children}
        </Text>
    )
}

export {SectionHeading}