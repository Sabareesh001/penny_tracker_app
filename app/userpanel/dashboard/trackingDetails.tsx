import { TrackingCard } from "@/components/trackingCard";
import { useTheme } from "@/theme/themeProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function TrackingDetails() {
    const params  = useLocalSearchParams()
    const {imgUrl,metal,unitMeasure,isModal} = params;
    const {theme} = useTheme();
    const styles = StyleSheet.create({
        containerStyle:{
            height:"100%",
            padding:theme?.paddings.page,
            backgroundColor:theme?.colors.secondary
        }
    })
    return (
        <View style={styles.containerStyle}>
            <TrackingCard
                imgUrl={Array.isArray(imgUrl)?"":imgUrl}
                metal={Array.isArray(metal)?"":metal}
                unitMeasure={Array.isArray(unitMeasure)?"":unitMeasure}
                isModal={true}
            />
            <Ionicons size={24} name="add"/>
        </View>
    )
}