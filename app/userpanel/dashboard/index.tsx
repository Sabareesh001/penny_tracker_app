import { TrackingCard } from "@/components/trackingCard/trackingCard";
import { useTheme } from "@/theme/themeProvider";
import { StyleSheet, View } from "react-native";

export default function Dashboard(){

    const {theme} = useTheme()

    const styles = StyleSheet.create({
        container:{
            flex:1,
            backgroundColor:'transparent',
            padding:theme?.paddings.page
        }
    })

    return(
    <View style={styles.container}>
      <TrackingCard/>
    </View>
    )
}

