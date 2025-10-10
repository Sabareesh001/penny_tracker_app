import { StyledChip } from "@/components/atoms/chip";
import { useTheme } from "@/theme/themeProvider";
import { GetCurrencySymbol } from "@/utils/currency";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { Text } from "@rneui/themed";
import { useEffect, useState } from "react";
import { Image, ImageBackground, StyleSheet, View } from "react-native";
import { TrackingCard } from "../tracking";

type SpendingBalanceProps = {
  monthlyIncome: number;
  savingTarget: number;
};

const SpendingBalance = (props: SpendingBalanceProps) => {
  const happy = require(`../../../assets/images/happy.png`);
  const sad = require(`../../../assets/images/sad.png`);
  const { theme } = useTheme();
  const [reactionImage, setReactionImage] = useState(happy)
  const [spendingBalance, setSpendingBalance] = useState(
    props.monthlyIncome - props.savingTarget
  );
  const [currencySymbol, setCurrencySymbol] = useState("");
  const styles = StyleSheet.create({
    leftContainer: {
      flex: 2,
      borderRadius: 10,
      padding: theme?.paddings.card,
    },
    rightContainer: {
      flex: 1,
      height: "100%",
      alignItems: "flex-end",
      borderRadius: theme?.border.radius,
      padding: theme?.paddings.card,
    },
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    balance: {
      fontSize: 40,
      fontWeight: "bold",
      textShadowColor: theme?.shadow.text,
      textShadowRadius: 10,
      textShadowOffset: { width: 0, height: 5 },
    },
    label: {
      fontSize: 14,
      fontWeight: "thin",
    },
  });

  useEffect(() => {
    const getCurrSym = async () => {
      setCurrencySymbol(await GetCurrencySymbol());
    };
    getCurrSym();
  }, [useAsyncStorage("currency")]);

  useEffect(() => {
    setReactionImage(spendingBalance <= 0 ?sad:happy)
  },[spendingBalance])

  return (
    <ImageBackground
      source={require("../../../assets/images/gradient.png")}
      borderRadius={10}
      style={styles.container}
    >
      <View style={styles.leftContainer}>
        <Text style={styles.label}>Spending balance</Text>
        <Text
          style={styles.balance}
        >{`${currencySymbol}${spendingBalance.toFixed(2)}`}</Text>
        <StyledChip
          color={theme?.colors.text}
          titleStyle={{ color: theme?.colors.primary }}
          icon={
            <FontAwesome5 size={16} name="eye" color={theme?.colors.primary} />
          }
        >
          spending history
        </StyledChip>
      </View>
      <View style={styles.rightContainer}>
        <Image
          resizeMode="contain"
          source={(reactionImage)}
          style={{ width: "100%", height: 100}}
        />
      </View>
    </ImageBackground>
  );
};

export { SpendingBalance };
