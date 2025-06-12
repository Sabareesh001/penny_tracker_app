import { useTheme } from "@/theme/themeProvider";
import { ReactNode } from "react";
import { StyleSheet, Text } from "react-native";



const Label = ({children}:{children:ReactNode})=>{
     const {theme} = useTheme()
    const styles = StyleSheet.create({
        label:{
             color : theme?.colors.text,
             fontSize: theme?.text.section.label.fontSize
        }
    })

    return(
    <Text style={styles.label}>
        {children}
    </Text>
)
}

export {Label}