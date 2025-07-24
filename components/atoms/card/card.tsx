import { useTheme } from "@/theme/themeProvider"
import { StyleSheet, View, ViewProps } from "react-native"


const Card = (props:ViewProps)=>{

    const {theme} = useTheme();

    const styles = StyleSheet.create({
        cardContainer:{
           padding:theme?.border.padding,
           borderColor: theme?.border.color,
           borderWidth:theme?.border.borderWidth,
           borderRadius:theme?.border.radius,
           backgroundColor:theme?.colors.primary
        }
    })
    
    return(
        <View  {...props} style={[styles.cardContainer,props.style]}>
            
        </View>
    )
}

export {Card}