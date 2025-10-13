import { Button } from "@/components/atoms/button/button";
import { SectionHeading } from "@/components/atoms/heading/heading";
import { Label } from "@/components/atoms/label/label";
import { TextField } from "@/components/atoms/textField/textField";
import { usePreferenceContext } from "@/store/currencyContext";
import { useTheme } from "@/theme/themeProvider";
import { BASE_URL } from "@/utils/apiHost";
import { GetCurrencySymbol } from "@/utils/currency";
import { ConvertCurrency } from "@/utils/currency/currencyConvertor";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { Skeleton } from "@rneui/themed";
import axios, { Axios, AxiosResponse } from "axios";
import getSymbolFromCurrency from "currency-symbol-map";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";

export default function Ledger() {
  const { theme } = useTheme();
  const { currency, country, weightMeasure } = usePreferenceContext();
  const [monthyIncome, setMonthlyIncome] = useState(0.0);
  const [originalMonthlyIncome, setOriginalMonthlyIncome] = useState(0.0);
  const [monthySavingsTarget, setMonthySavingsTarget] = useState(0.0);
  const [originalMonthlySavingsTarget, setOriginalMonthlySavingsTarget] =
    useState(0.0);
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [incomeSaveLoading, setIncomeSaveLoading] = useState(false);
  const [savingTargetSaveLoading, setSavingTargetSaveLoading] = useState(false);
  const [monthyIncomeLoading, setMonthlyIncomeLoading] = useState(false);
  const [monthySavingLoading, setSavingIncomeLoading] = useState(false);

  const styles = StyleSheet.create({
    pageContainer: {
      padding: theme?.paddings.page,
      gap: theme?.gaps.form,
    },
    incomeContainer: {
      flexDirection: "row",
      gap: 10,
    },
  });

  type IncomeResponse = {
    message: string;
    data: {
      monthly_income: number;
      monthly_income_currency: string;
    };
  };

  type SavingsTargetResponse = {
    message: string;
    data: {
      monthly_saving_target: number;
      monthly_saving_currency: string;
    };
  };

  const fetchMonthlySavingTarget = () => {
    setSavingIncomeLoading(true);
    axios
      .get(`${BASE_URL}/api/v1/saving/target`)
      .then(async (res: AxiosResponse<SavingsTargetResponse>) => {
        let convertedTarget = res.data.data.monthly_saving_target;
        const storedCurrency = res.data.data.monthly_saving_currency;

        if (storedCurrency !== currency && convertedTarget !== 0) {
          convertedTarget = await ConvertCurrency({
            amount: convertedTarget,
            from: storedCurrency,
            to: currency,
          });
        }

        setMonthySavingsTarget(convertedTarget);
        setOriginalMonthlySavingsTarget(convertedTarget);
      })
      .catch((err) => {
        console.log(err.response);
      })
      .finally(() => {
        setSavingIncomeLoading(false);
      });
  };

  const fetchMonthlyIncome = () => {
    setMonthlyIncomeLoading(true);
    axios
      .get(`${BASE_URL}/api/v1/income`)
      .then(async (res: AxiosResponse<IncomeResponse>) => {
        let convertedIncome = res.data.data.monthly_income;
        const storedMonthlyIncomeCurrency =
          res.data.data.monthly_income_currency;
        if (storedMonthlyIncomeCurrency != currency && convertedIncome != 0) {
          convertedIncome = await ConvertCurrency({
            amount: res.data.data.monthly_income,
            from: storedMonthlyIncomeCurrency,
            to: currency,
          });
        }
        setMonthlyIncome(convertedIncome);
        setOriginalMonthlyIncome(convertedIncome);
      })
      .catch((err) => {
        console.log(err.response);
      })
      .finally(() => {
        setMonthlyIncomeLoading(false);
      });
  };

  const saveNewIncome = async () => {
    setIncomeSaveLoading(true);
    axios
      .patch(`${BASE_URL}/api/v1/income/`, {
        income: monthyIncome,
        currency: currency,
      })
      .then((res) => {
        setOriginalMonthlyIncome(monthyIncome);
        Toast.show({
          type: "success",
          text1: res.data.message,
        });
      })
      .catch((err) => {
        Toast.show({
          type: "error",
          text1: err.response.data.error,
        });
      })
      .finally(() => {
        setIncomeSaveLoading(false);
      });
  };

  const saveNewSavingTarget = async () => {
    setSavingTargetSaveLoading(true);
    axios
      .patch(`${BASE_URL}/api/v1/saving/target`, {
        monthly_saving_target: monthySavingsTarget,
        currency: currency,
      })
      .then((res) => {
        setOriginalMonthlySavingsTarget(monthySavingsTarget);
        Toast.show({
          type: "success",
          text1: res.data.message,
        });
      })
      .catch((err) => {
        Toast.show({
          type: "error",
          text1: err.response.data.error,
        });
      })
      .finally(() => {
        setSavingTargetSaveLoading(false);
      });
  };

  useFocusEffect(
    useCallback(() => {
      fetchMonthlyIncome();
      fetchMonthlySavingTarget();
    }, [currency])
  );

  useEffect(() => {
    const setCurrSymbol = async () => {
      const symbol = await GetCurrencySymbol();
      setCurrencySymbol(symbol);
    };

    setCurrSymbol();
  }, [currency]);

  return (
    <View style={styles.pageContainer}>
      <Label>Monthly Income</Label>
      <View style={styles.incomeContainer}>
        <View style={{ flex: 9 }}>
          {!monthyIncomeLoading ? (
            <TextField
              keyboardType="number-pad"
              inputMode="numeric"
              onChangeText={(e) => {
                setMonthlyIncome(() => {
                  const converted = Number(e.split(" ")[1]);
                  return isNaN(converted) ? 0 : converted;
                });
              }}
              editable
              value={`${currencySymbol} ${monthyIncome.toFixed(2)}`}
            ></TextField>
          ) : (
            <Skeleton></Skeleton>
          )}
        </View>
        <Button
          onPress={saveNewIncome}
          loading={incomeSaveLoading}
          containerStyle={{ flex: 2 }}
          disabled={originalMonthlyIncome == monthyIncome}
          icon={
            <AntDesign name="save" size={20} color={theme?.colors.secondary} />
          }
        />
      </View>
      <Label>Monthly Savings Target</Label>
      <View style={styles.incomeContainer}>
        <View style={{ flex: 9 }}>
          {!monthySavingLoading ? (
            <TextField
              keyboardType="number-pad"
              inputMode="numeric"
              onChangeText={(e) => {
                setMonthySavingsTarget(() => {
                  const converted = Number(e.slice(1));
                  return isNaN(converted) ? 0 : converted;
                });
              }}
              editable
              value={`${currencySymbol} ${monthySavingsTarget.toFixed(2)}`}
            ></TextField>
          ) : (
            <Skeleton />
          )}
        </View>
        <Button
          onPress={saveNewSavingTarget}
          loading={savingTargetSaveLoading}
          containerStyle={{ flex: 2 }}
          disabled={originalMonthlySavingsTarget === monthySavingsTarget}
          icon={
            <AntDesign name="save" size={20} color={theme?.colors.secondary} />
          }
        />
      </View>
    </View>
  );
}
