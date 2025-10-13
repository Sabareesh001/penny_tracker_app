import { StyledChip } from "@/components/atoms/chip";
import { useTheme } from "@/theme/themeProvider";
import { GetCurrencySymbol } from "@/utils/currency";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { Skeleton, Text } from "@rneui/themed";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Image, ImageBackground, Pressable, StyleSheet, View } from "react-native";
import { TrackingCard } from "../tracking";
import { ConvertCurrency } from "@/utils/currency/currencyConvertor";
import axios from "axios";
import { BASE_URL } from "@/utils/apiHost";
import { useFocusEffect } from "expo-router";
import { usePreferenceContext } from "@/store/currencyContext";
import { LinearGradient } from "expo-linear-gradient";



const SpendingBalance = () => {
  const happy = require(`../../../assets/images/happy.png`);
  const sad = require(`../../../assets/images/sad.png`);
  const {currency} = usePreferenceContext();
  const { theme } = useTheme();
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [spendingBalanceLoading, setSpendingBalanceLoading] = useState(false);
  const savingTarget = 0;

  useEffect(() => {
    setSpendingBalance(monthlyIncome - savingTarget);
},[monthlyIncome])

  
  const fetchMonthlyIncome = () => {
    setSpendingBalanceLoading(true);
    if (!currency) return;
    axios
      .get(`${BASE_URL}/api/v1/income`)
      .then(async (res) => {
        let convertedIncome = res.data.data.monthly_income;
        const storedMonthlyIncomeCurrency = res.data.data.monthly_income_currency;
          if (storedMonthlyIncomeCurrency != currency || convertedIncome != 0) {
            convertedIncome = await ConvertCurrency({
              amount: res.data.data.monthly_income,
              from: storedMonthlyIncomeCurrency,
              to: currency,
            });
          }
          console.log(res.data.data.monthly_income,convertedIncome,storedMonthlyIncomeCurrency,currency)
        setMonthlyIncome(convertedIncome);
      })
      .catch(() => { }).finally(() => {
        setSpendingBalanceLoading(false);
      });
  }
  
  
  const rotatePanda = useRef(new Animated.Value(0)).current;
  
  const [reactionImage, setReactionImage] = useState(happy);
  const [spendingBalance, setSpendingBalance] = useState(
    monthlyIncome - savingTarget
  );
  const [currencySymbol, setCurrencySymbol] = useState("");
  const styles = StyleSheet.create({
    leftContainer: {
      flex: 2,
      borderRadius: 10,
      gap:theme?.gaps.info,
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
      fontSize: 40-((spendingBalance.toFixed(2)+"").length)-1,
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
      justifyContent: 'center',
    }
  });

  useEffect(() => {
    const getCurrSym = async () => {
      setCurrencySymbol(await GetCurrencySymbol());
    };
    getCurrSym();
  }, [useAsyncStorage("currency")]);
  
  useEffect(() => {
    setReactionImage(spendingBalance <= 0 ? sad : happy);
  }, [spendingBalance]);
  const reload = () => {
    rotatePanda.setValue(0);
    Animated.timing(rotatePanda, {
      toValue: 1,
      duration:1000,
      useNativeDriver: false,
    }).start();
    fetchMonthlyIncome();
  }
  useFocusEffect(useCallback(reload, [currency]))
  return (
    <ImageBackground
    source={require("../../../assets/images/gradient.png")}
    borderRadius={10}
    style={styles.container}
    >
      
      <View style={styles.leftContainer}>
        <Text style={styles.label}>Spending balance</Text>
        <View style={styles.incomeContainer}>

        {!spendingBalanceLoading ? (
          <Text
            
            style={[styles.balance]}
          >{`${currencySymbol}${spendingBalance.toFixed(2)}`}</Text>
        ) : (
          <Skeleton
            skeletonStyle={{
              backgroundColor: "#f06024",
            }}
            style={{
              backgroundColor: "#fab073",
            }}
            animation="wave"
            height={40}
          />
        )}
        </View>
        <StyledChip
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
            width: "100%", height: 100, transform: [{
              rotate: rotatePanda.interpolate(
                {
                  inputRange:[0, 1],
                  outputRange:['0deg','360deg']
            }
          )}]}}
        />
        </Pressable>
      </View>
    </ImageBackground>
  );
};

export { SpendingBalance };
