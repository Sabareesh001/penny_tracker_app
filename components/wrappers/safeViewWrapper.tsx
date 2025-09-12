import { getRneTheme } from "@/theme/rneTheme";
import { useTheme } from "@/theme/themeProvider";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeProvider as RneThemeProvider } from '@rneui/themed';


const SafeViewWrapper = ({children}:{children:ReactNode})=>{
    const {theme,backgroundColor,setBackground} = useTheme()
    const styles = StyleSheet.create({
        wrapper :{
            flex:1,
            backgroundColor:backgroundColor
        }
    })
    const rneTheme = getRneTheme();
  return(
    <RneThemeProvider theme={rneTheme}>
    <View style={styles.wrapper} >
        <SafeAreaView>
        {children}
        </SafeAreaView>
    </View>
    </RneThemeProvider>
  )
}

export default SafeViewWrapper;