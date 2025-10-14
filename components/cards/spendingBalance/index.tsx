import { StyledChip } from "@/components/atoms/chip";
import { useTheme } from "@/theme/themeProvider";
import { GetCurrencySymbol } from "@/utils/currency";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
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
import Toast from "react-native-toast-message";

const SpendingBalance = () => {
  const happy = require(`../../../assets/images/happy.png`);
  const sad = require(`../../../assets/images/sad.png`);
  const { currency } = usePreferenceContext();
  const { theme } = useTheme();

  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [savingTarget, setSavingTarget] = useState(0);
  const [spendingBalance, setSpendingBalance] = useState(0);
  const currencySymbol = GetCurrencySymbol();
  const [spendingBalanceLoading, setSpendingBalanceLoading] = useState(false);

  const rotatePanda = useRef(new Animated.Value(0)).current;
  const [reactionImage, setReactionImage] = useState(happy);
  const [monthlyPayments, setMonthlyPayments] = useState(0);
  const [safeThreshold, setSafeThreshold] = useState(0);
  const [alertPercentage, setAlertPercentage] = useState(0); // NEW

  // ========== Fetch Monthly Payments ==========
  const fetchMonthlyPayments = async () => {
    setSpendingBalanceLoading(true);
    try {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      const res = await axios.get(`${BASE_URL}/api/v1/spending/monthly-total`, {
        params: { month, year },
      });

      if (res.data.data && res.data.data.total !== undefined) {
        setMonthlyPayments(res.data.data.total);
      }
    } catch (err) {
      console.error("Monthly payments fetch error:", err);
    } finally {
      setSpendingBalanceLoading(false);
    }
  };

  const sendAlertEmail = async () => {
      console.log("Triggered")
      try {
        await axios.post(`${BASE_URL}/api/v1/spending/alert/send`);
        Toast.show({
          type: "info",
          text1: "Alert email sent successfully!",
        });
      } catch (err) {
        console.error("Alert email send error:", err);
        Toast.show({
          type: "error",
          text1: "Failed to send alert email",
        });
      }
    };

  useEffect(() => {
    if (safeThreshold > spendingBalance) sendAlertEmail();
   },[spendingBalance,safeThreshold])
  
  // ========== Fetch Alert Percentage ==========
  const fetchAlertPercentage = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/spending/alert-percentage`);
      const value = res.data.data.alert_percentage ?? res.data.data ?? 0;
      setAlertPercentage(value);
    } catch (err) {
      console.error("Alert percentage fetch error:", err);
    }
  };

  // ========== Update Safe Threshold whenever alert or savingTarget changes ==========
  useEffect(() => {
    const threshold = savingTarget * (alertPercentage / 100);
    setSafeThreshold(threshold);
    console.log("Thres",threshold)
  }, [alertPercentage, savingTarget]);

  // ========== Update Spending Balance whenever data changes ==========
  useEffect(() => {
    setSpendingBalance(monthlyIncome - savingTarget - monthlyPayments);
  }, [monthlyIncome, savingTarget, monthlyPayments]);

  // ========== Reaction Image Change ==========
  useEffect(() => {
    setReactionImage(spendingBalance <= safeThreshold ? sad : happy);
  }, [spendingBalance, safeThreshold]);

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
      console.log("Saving target fetch error:", err);
    } finally {
      setSpendingBalanceLoading(false);
    }
  };

  // ========== Reload Animation & Fetch All ==========
  const reload = () => {
    rotatePanda.setValue(0);
    Animated.timing(rotatePanda, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
    fetchMonthlyIncome();
    fetchMonthlySavingTarget();
    fetchMonthlyPayments();
    fetchAlertPercentage(); // NEW
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
      textShadowColor: safeThreshold < spendingBalance ? theme?.shadow.text:theme?.colors.danger.danger,
      textShadowRadius: safeThreshold < spendingBalance ? 10 : 20,
      borderRadius: theme?.border.radius,
      textShadowOffset: safeThreshold < spendingBalance ? ({ width: 0, height: 5 }) : ({ width: 0, height:0}),
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
          onPress={() => {
            router.push("/userpanel/dashboard/spendingHistory");
          }}
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
