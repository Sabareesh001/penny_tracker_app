import { useTheme } from "@/theme/themeProvider"
import ThemedCard,{CardProps} from "@rneui/themed/dist/Card";
import { StyleSheet, View, ViewProps } from "react-native"


const Card = (props:CardProps & {children:React.ReactNode})=>{

    const {theme} = useTheme();

    const styles = StyleSheet.create({
        cardContainer:{
           padding:theme?.border.padding,
           borderColor: theme?.border.color,
           borderWidth:theme?.border.borderWidth,
           borderRadius:theme?.border.radius,
           backgroundColor:theme?.colors.primary,
           width:'100%'
        }
    })
    
    return(
        <ThemedCard  {...props} containerStyle={[styles.cardContainer,props.containerStyle]}>
            
        </ThemedCard>
    )
}

export {Card}