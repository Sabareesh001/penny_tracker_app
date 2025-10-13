
import { usePreferenceContext } from "@/store/currencyContext";
import { useTheme } from "@/theme/themeProvider";
import { GetCurrencySymbol } from "@/utils/currency";
import Ionicons from "@expo/vector-icons/Ionicons";
import {  Text } from "@rneui/themed"
import { StyleSheet, View } from "react-native";


type PaymentCardProps = {
    color: string,
}

function lightenColor(hex:string) {
  const amount = 0.74; 
  const num = parseInt(hex.slice(1), 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;

  const newR = Math.round(r + (255 - r) * amount -180);
  const newG = Math.round(g + (255 - g) * amount) -180;
  const newB = Math.round(b + (255 - b) * amount) -180;

  return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB)
    .toString(16)
    .slice(1)}`;
}


const PaymentCard = (props:PaymentCardProps) => {
    const { theme } = useTheme();
    const currSymbol = GetCurrencySymbol();
    const styles = StyleSheet.create({
      catergoryColorCode: {
        backgroundColor: props.color,
        width: 5,
        borderTopLeftRadius: theme?.border.radius,
        borderBottomLeftRadius: theme?.border.radius,
      },
      container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: lightenColor(props.color),
        padding: theme?.paddings.card,
        borderRadius: theme?.border.radius,
        borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        flex:1
      },
      cardContainer: {
          flexDirection: "row",
        },
      
    });
    return (
      <View style={styles.cardContainer}>
        <View style={styles.catergoryColorCode}></View>
        <View style={styles.container}>
          <Text>{`${currSymbol} 1000`}</Text>
          <Text>{`12-10-2025`}</Text>
          <Text>{`12:12`}</Text>
          <Ionicons color={theme?.colors.text} size={24} name="eye" />
        </View>
      </View>
    );
}

export { PaymentCard };