import { StyleSheet } from "react-native"
import { View } from "react-native"
import { Loader } from "."
import { useTheme } from "@/theme/themeProvider"
import { getFullPageLoader } from "@/store/pageContext"

const FullPageLoader = ()=>{

    const {theme} = useTheme()

    const fullPageLoader = getFullPageLoader();

    const styles = StyleSheet.create({
        view:{
             position:'absolute',
             height:'100%',
             backgroundColor:theme?.colors.secondary+"90",
             width:'100%',
             zIndex:999,
             justifyContent:'center',
             alignItems:'center'
        },
        loaderBox:{
            padding:theme?.border.padding,
            borderWidth:theme?.border.borderWidth,
            borderColor:theme?.border.color,
            backgroundColor:theme?.colors.primary,
            borderRadius:theme?.border.radius
        }
    })

    return(
        fullPageLoader.fullPageLoaderOpen &&
        <View style={styles.view}>
            <View style={styles.loaderBox} >
            <Loader/>
            </View>
        </View>
    )
}


export {FullPageLoader};