import { useTheme } from "@/theme/themeProvider";
import { GestureResponderEvent, Pressable, StyleSheet, Text, View } from "react-native";
import { CircularProgress } from '@expo/ui/jetpack-compose';
import { Loader } from "../loader/loader";
const Button = ({loading,title,onPress,inverted,disabled}:{loading?:boolean,title:string,onPress:((event: GestureResponderEvent) => void),inverted?:boolean,disabled?:boolean})=>{
    const {theme} = useTheme()
    const styles = StyleSheet.create({
        button:{
            width:'100%',
            alignItems:'center',
            justifyContent:'center',
            borderWidth:theme?.border.borderWidth,
            padding:theme?.button.primary.padding,
            borderRadius:theme?.border.radius,
            borderColor:theme?.border.color,
            backgroundColor:theme?.colors.primary,
        },
        buttonDisabled:{
           backgroundColor:theme?.colors.primaryDisabled,
        },
        buttonInvert:{
             borderColor:theme?.border.color,
            backgroundColor:theme?.colors.secondary,
        },
        content:{
            height:30,
        },
        label:{
            color:theme?.colors.secondary,
            fontSize:theme?.button.primary.fontSize,
        }
        ,
        labelInverted : {
            color:theme?.colors.primary
        }
    })
    return(
        <Pressable onPress={onPress} disabled={loading || disabled} style={{...styles.button,...(inverted && styles.buttonInvert),...(disabled && styles.buttonDisabled)}} >
            <View style={styles.content}>
            {
                loading?
                (
                    <Loader/>
                ):(
                    <Text style={{...styles.label,...(inverted && styles.labelInverted)}}>
                    {title}
                    </Text>
                )
            }
            </View>
            
        </Pressable>
    )

}

export {Button};