import { useTheme } from "@/theme/themeProvider";
import { GestureResponderEvent, Pressable, StyleSheet, Text, View } from "react-native";
import { CircularProgress } from '@expo/ui/jetpack-compose';
import { Loader } from "../loader/loader";
const Button = ({loading,title,onPress,inverted,disabled,icon}:{loading?:boolean,title:string,onPress:((event: GestureResponderEvent) => void),inverted?:boolean,disabled?:boolean,icon?:React.ReactNode})=>{
    const {theme} = useTheme()
    const styles = StyleSheet.create({
        button:{
            flex:1,
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
          
        },
        label:{
            color:theme?.colors.secondary,
            fontSize:theme?.button.primary.fontSize,
        }
        ,
        labelInverted : {
            color:theme?.colors.primary
        },
        buttonContent:{
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'space-around',
            gap:theme?.gaps.info
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
                    <View style={styles.buttonContent}>
                    {icon}
                    <Text style={{...styles.label,...(inverted && styles.labelInverted)}}>
                    {title}
                    </Text>
                    </View>
                )
            }
            </View>
            
        </Pressable>
    )

}

export {Button};