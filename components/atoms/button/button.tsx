import { useTheme } from "@/theme/themeProvider";
import { ButtonProps, Button as ThemedButton } from "@rneui/themed";
import { StyleSheet } from "react-native";
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
        backgroundColor:theme?.colors.primaryDisabled,
    },
    diabledTitle:{
       color:theme?.colors.secondary
    },
    container:{
        borderRadius:theme?.border.radius,
        // borderWidth:theme?.border.borderWidth,
        borderColor:theme?.border.color,
       }
       ,
       button:{
        height:props.height || 50,
        gap:theme?.gaps.info
       },
       iconContainerStyle:{
          
       }
       
    })
    return(
        <ThemedButton iconContainerStyle={styles.iconContainerStyle}  buttonStyle={styles.button} disabledTitleStyle={styles.diabledTitle} disabledStyle={styles.disabled} containerStyle={styles.container}  loadingProps={{color:spinnerColor}} titleStyle={styles.title} {...props} >

        </ThemedButton>
    )

}

export { Button };
