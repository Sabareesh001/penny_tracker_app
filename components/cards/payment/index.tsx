
import { usePreferenceContext } from "@/store/currencyContext";
import { useTheme } from "@/theme/themeProvider";
import { GetCurrencySymbol } from "@/utils/currency";
import Ionicons from "@expo/vector-icons/Ionicons";
import {  Text } from "@rneui/themed"
import { StyleSheet, View } from "react-native";


type PaymentCardProps = {
  color: string,
  amount: number,
  label: string,
  date: string,
  time:string
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
        backgroundColor:theme?.colors.neutral2,
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
          <Text>{`${props.label}`}</Text>
          <Text>{`${currSymbol} ${props.amount}`}</Text>
          <Text>{`${props.date}`}</Text>
          <Text>{`${props.time}`}</Text>
          <Ionicons color={theme?.colors.text} size={24} name="eye" />
        </View>
      </View>
    );
}

export { PaymentCard };