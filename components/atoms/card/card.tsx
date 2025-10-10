import { useTheme } from "@/theme/themeProvider"
import ThemedCard,{CardProps} from "@rneui/themed/dist/Card";
import { StyleSheet, View, ViewProps } from "react-native"


const Card = (props:CardProps & {children:React.ReactNode})=>{

    const {theme} = useTheme();

    const styles = StyleSheet.create({
        cardContainer:{
           padding:theme?.border.padding,
           backgroundColor:theme?.colors.secondary,
            width: '100%',
            borderWidth: 0,
        }
    })
    
    return(
        <ThemedCard  {...props} containerStyle={[styles.cardContainer,props.containerStyle]}>
            
        </ThemedCard>
    )
}

export {Card}