import { useTheme } from "@/theme/themeProvider";
import { StyleSheet, View } from "react-native";

const SpendingBalance = () => {

    const {theme} = useTheme()
    const styles = StyleSheet.create({
        container: {
            height: 150,
            backgroundColor:theme?.colors.primary,
            borderRadius:theme?.border.radius,
      }
  });

    return (<View style={styles.container}>
      
  </View>);
};

export { SpendingBalance };
