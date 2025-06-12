import { useTheme } from "@/theme/themeProvider";
import { Pressable, StyleSheet, Text } from "react-native";
import { CircularProgress } from '@expo/ui/jetpack-compose';
const Button = (props:any)=>{
    const {theme} = useTheme()
    const styles = StyleSheet.create({
        button:{
            width:'100%',
            alignItems:'center',
            borderWidth:theme?.border.borderWidth,
            borderColor:theme?.border.color,
            padding:theme?.button.primary.padding,
            borderRadius:theme?.border.radius,
            backgroundColor:theme?.colors.primary,
        },
        label:{
            color:theme?.colors.secondary,
            fontSize:theme?.button.primary.fontSize,
        }
    })
    return(
        <Pressable {...props} style={styles.button} >
            {
                props.loading?
                (
                    <CircularProgress progress={0.5} style={{ width: 300 }} color="blue" elementColors={{ trackColor: '#cccccc' }}/>
                ):(
                    <Text style={styles.label}>
                    {props.title}
                    </Text>
                )
            }
            
        </Pressable>
    )

}

export {Button};