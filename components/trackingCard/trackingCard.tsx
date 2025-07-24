import { Image, StyleSheet, Text, View } from "react-native";
import { Card } from "../atoms/card/card"
import { useTheme } from "@/theme/themeProvider";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { LiveIcon } from "../atoms/liveIcon/liveIcon";


const TrackingCard = ()=>{
    const {theme} = useTheme();
    const styles = StyleSheet.create({
      cardContainer: {
        flexDirection: "row",
        gap: theme?.gaps.form,
        width: "100%",
      },
      infoContainer: {
        flex: 1,
      },
      iconsContainer: {
        gap: theme?.gaps.form,
        alignItems: "flex-start",
      },
      icon: {
        height: 25,
        width: 25,
        justifyContent: "center",
        alignItems: "center",
      },
    });
    return (
      <Card style={styles.cardContainer}>
        <Image
          source={{ uri: "https://pngimg.com/d/gold_PNG10981.png" }}
          height={100}
          width={100}
        ></Image>
        <View style={styles.infoContainer}>
          <View style={styles.iconsContainer}>
            <LiveIcon />
            <View style={styles.icon}>
              <FontAwesome5 size={16} name="piggy-bank" />
            </View>
            <View style={styles.icon}>
            <FontAwesome5  size={16} name="weight-hanging" />
            </View>
          </View>
        </View>
      </Card>
    );
}

export {TrackingCard};