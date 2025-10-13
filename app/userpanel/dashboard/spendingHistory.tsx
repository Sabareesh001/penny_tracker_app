import { PaymentCard } from "@/components/cards/payment";
import { useTheme } from "@/theme/themeProvider";
import { StyleSheet, View } from "react-native";

export default function SpendingHistory() {
    const {theme} = useTheme();
    const styles = StyleSheet.create({
        container: {
            gap:theme?.gaps.form
        },
        pageContainer: {
            backgroundColor: 'red',
            flex:1
        }
    })
    return (
        <View style={styles.pageContainer}>
      <View style={styles.container}>
        <PaymentCard color="#ff0000" />
        <PaymentCard color="#00ff00" />
        <PaymentCard color="#ffffff" />
        <PaymentCard color="#ff0000" />
      </View>
        </View>
    );
}

export { SpendingHistory };