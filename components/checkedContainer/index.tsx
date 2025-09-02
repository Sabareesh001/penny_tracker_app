import { Pressable, PressableProps, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Card } from "../atoms/card/card";
import { CheckBox } from "@rneui/themed";

const CheckedContainer = (props:{children:React.ReactNode,checked:boolean} & PressableProps)=>{
    const styles = StyleSheet.create({
        container:{
            position:'relative'
        },
        checkbox:{
            position:'absolute',
            top:0,
            right:0,
            transform:[{translateX:20},{translateY:-10}]
        }
    })
        return(
            <Pressable onPress={props.onPress}>
            <View style={styles.container} >
            <Card children={props.children} >
                
            </Card>
            <CheckBox onPress={props.onPress} containerStyle={styles.checkbox} checked={props.checked} />
            </View>
            </Pressable>
        )
}

export {CheckedContainer};