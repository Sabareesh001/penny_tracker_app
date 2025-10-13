import { StyledChip } from "@/components/atoms/chip";
import { useTheme } from "@/theme/themeProvider";
import { GetCurrencySymbol } from "@/utils/currency";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { Skeleton, Text } from "@rneui/themed";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { ConvertCurrency } from "@/utils/currency/currencyConvertor";
import axios from "axios";
import { BASE_URL } from "@/utils/apiHost";
import { router, useFocusEffect } from "expo-router";
import { usePreferenceContext } from "@/store/currencyContext";

const SpendingBalance = () => {
  const happy = require(`../../../assets/images/happy.png`);
  const sad = require(`../../../assets/images/sad.png`);
  const { currency } = usePreferenceContext();
  const { theme } = useTheme();

  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [savingTarget, setSavingTarget] = useState(0);
  const [spendingBalance, setSpendingBalance] = useState(0);
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [spendingBalanceLoading, setSpendingBalanceLoading] = useState(false);

  const rotatePanda = useRef(new Animated.Value(0)).current;
  const [reactionImage, setReactionImage] = useState(happy);

  // ========== Fetch Monthly Income ==========
  const fetchMonthlyIncome = async () => {
    setSpendingBalanceLoading(true);
    if (!currency) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/income`);
      let convertedIncome = res.data.data.monthly_income;
      const storedCurrency = res.data.data.monthly_income_currency;

      if (storedCurrency !== currency && convertedIncome !== 0) {
        convertedIncome = await ConvertCurrency({
          amount: convertedIncome,
          from: storedCurrency,
          to: currency,
        });
      }

      setMonthlyIncome(convertedIncome);
    } catch (err) {
      console.log(err);
    } finally {
      setSpendingBalanceLoading(false);
    }
  };

  // ========== Fetch Monthly Saving Target ==========
  const fetchMonthlySavingTarget = async () => {
    setSpendingBalanceLoading(true);
    if (!currency) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/saving/target`);
      let convertedTarget = res.data.data.monthly_saving_target;
      const storedCurrency = res.data.data.monthly_saving_currency;

      if (storedCurrency !== currency && convertedTarget !== 0) {
        convertedTarget = await ConvertCurrency({
          amount: convertedTarget,
          from: storedCurrency,
          to: currency,
        });
      }

      setSavingTarget(convertedTarget);
    } catch (err) {
      console.log(
        "Saving target fetch error:",
        err
      );
    } finally {
      setSpendingBalanceLoading(false);
    }
  };

  // ========== Update Spending Balance whenever data changes ==========
  useEffect(() => {
    setSpendingBalance(monthlyIncome - savingTarget);
  }, [monthlyIncome, savingTarget]);

  // ========== Fetch Currency Symbol ==========
  useEffect(() => {
    const getCurrSym = async () => {
      setCurrencySymbol(await GetCurrencySymbol());
    };
    getCurrSym();
  }, [useAsyncStorage("currency")]);

  // ========== Reaction Image Change ==========
  useEffect(() => {
    setReactionImage(spendingBalance <= 0 ? sad : happy);
  }, [spendingBalance]);

  // ========== Reload Animation & Fetch Both ==========
  const reload = () => {
    rotatePanda.setValue(0);
    Animated.timing(rotatePanda, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
    fetchMonthlyIncome();
    fetchMonthlySavingTarget();
  };

  // ========== Auto-fetch on Focus ==========
  useFocusEffect(useCallback(reload, [currency]));

  // ========== Styles ==========
  const styles = StyleSheet.create({
    leftContainer: {
      flex: 2,
      borderRadius: 10,
      gap: theme?.gaps.info,
      padding: theme?.paddings.card,
    },
    rightContainer: {
      flex: 1,
      borderRadius: theme?.border.radius,
      padding: theme?.paddings.card,
    },
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    balance: {
      fontSize: 40 - (spendingBalance.toFixed(2) + "").length - 1,
      fontWeight: "bold",
      textShadowColor: theme?.shadow.text,
      textShadowRadius: 10,
      textShadowOffset: { width: 0, height: 5 },
    },
    label: {
      fontSize: 14,
      fontWeight: "thin",
    },
    incomeContainer: {
      height: 50,
      justifyContent: "center",
    },
  });

  // ========== Render ==========
  return (
    <ImageBackground
      source={require("../../../assets/images/gradient.png")}
      borderRadius={10}
      style={styles.container}
    >
      <View style={styles.leftContainer}>
        <Text style={styles.label}>Spending Balance</Text>
        <View style={styles.incomeContainer}>
          {!spendingBalanceLoading ? (
            <Text style={[styles.balance]}>
              {`${currencySymbol}${spendingBalance.toFixed(2)}`}
            </Text>
          ) : (
            <Skeleton
              skeletonStyle={{ backgroundColor: "#f06024" }}
              style={{ backgroundColor: "#fab073" }}
              animation="wave"
              height={40}
            />
          )}
        </View>

        <StyledChip
          onPress={()=>{router.push("/userpanel/dashboard/spendingHistory")}}
          color={theme?.colors.text}
          buttonStyle={{ padding: 3 }}
          titleStyle={{ color: theme?.colors.primary }}
          icon={
            <FontAwesome5 size={16} name="eye" color={theme?.colors.primary} />
          }
        >
          spending history
        </StyledChip>
      </View>

      <View style={styles.rightContainer}>
        <Pressable onPress={reload}>
          <Animated.Image
            resizeMode="contain"
            source={reactionImage}
            style={{
              width: "100%",
              height: 100,
              transform: [
                {
                  rotate: rotatePanda.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            }}
          />
        </Pressable>
      </View>
    </ImageBackground>
  );
};

export { SpendingBalance };
