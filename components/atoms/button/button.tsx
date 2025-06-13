import { useTheme } from "@/theme/themeProvider";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CircularProgress } from '@expo/ui/jetpack-compose';
const Button = (props:any)=>{
    const {theme} = useTheme()
    const styles = StyleSheet.create({
        button:{
            width:'100%',
            alignItems:'center',
            justifyContent:'center',
            borderWidth:theme?.border.borderWidth,
            borderColor:theme?.border.color,
            padding:theme?.button.primary.padding,
            borderRadius:theme?.border.radius,
            backgroundColor:theme?.colors.primary,
        },
        content:{
            height:30,
        },
        label:{
            color:theme?.colors.secondary,
            fontSize:theme?.button.primary.fontSize,
        }
    })
    return(
        <Pressable {...props} disabled={props.loading} style={styles.button} >
            <View style={styles.content}>
            {
                props.loading?
                (
                    <CircularProgress progress={null} style={{ width: 28, height:28 }}  color={theme?.colors.secondary} elementColors={{ trackColor: 'transparent' }}/>
                ):(
                    <Text style={styles.label}>
                    {props.title}
                    </Text>
                )
            }
            </View>
            
        </Pressable>
    )

}

export {Button};