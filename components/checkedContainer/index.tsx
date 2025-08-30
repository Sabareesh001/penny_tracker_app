import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Card } from "../atoms/card/card";
import { CheckBox } from "@rneui/themed";

const CheckedContainer = (props:{children:React.ReactNode,checked:boolean})=>{
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
            <View style={styles.container} >
            <Card children={props.children} >
                
            </Card>
            <CheckBox containerStyle={styles.checkbox} checked={props.checked} />
            </View>
        )
}

export {CheckedContainer};