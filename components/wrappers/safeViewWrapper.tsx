import { useTheme } from "@/theme/themeProvider";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const SafeViewWrapper = ({children}:{children:ReactNode})=>{
    const {theme,backgroundColor,setBackground} = useTheme()
    const styles = StyleSheet.create({
        wrapper :{
            flex:1,
            backgroundColor:backgroundColor
        }
    })
  return(
    <View style={styles.wrapper} >
        <SafeAreaView>
        {children}
        </SafeAreaView>
    </View>
  )
}

export default SafeViewWrapper;