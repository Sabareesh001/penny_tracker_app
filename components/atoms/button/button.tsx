import { useTheme } from "@/theme/themeProvider";
import { GestureResponderEvent, Pressable, StyleSheet, Text, View } from "react-native";
import { CircularProgress } from '@expo/ui/jetpack-compose';
import { Loader } from "../loader/loader";
import { Button as ThemedButton,ButtonProps } from "@rneui/themed";
import { color } from "@rneui/base";
const Button = (props:ButtonProps & {height?:number})=>{
    const {theme} = useTheme()
    const spinnerColor = !props.disabled?theme?.colors.secondary:theme?.colors.primary
    const styles = StyleSheet.create({
       title:{
           color:theme?.colors.secondary
       },
       loading:{
        
       },
       disabled:{
        backgroundColor:theme?.colors.primaryDisabled
    },
    container:{
        borderRadius:theme?.border.radius,
        borderWidth:theme?.border.borderWidth,
        borderColor:theme?.border.color,
       }
       ,
       button:{
        height:props.height || 50,
       }
       
    })
    return(
        <ThemedButton buttonStyle={styles.button} disabledStyle={styles.disabled} containerStyle={styles.container}  loadingProps={{color:spinnerColor}} titleStyle={styles.title} {...props}>

        </ThemedButton>
    )

}

export {Button};