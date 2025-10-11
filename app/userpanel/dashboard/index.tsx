import { SectionHeading } from "@/components/atoms/heading/heading";
import { Loader } from "@/components/atoms/loader";
import { FloatingActionButton } from "@/components/floatingActionButton";
import { TrackingCard } from "@/components/cards/tracking";
import { getFullPageLoader } from "@/store/pageContext";
import { useTheme } from "@/theme/themeProvider";
import { BASE_URL } from "@/utils/apiHost";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { Switch, Tab, Text } from "@rneui/themed";
import axios from "axios";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Animated, ScrollView, StyleSheet, View } from "react-native";
import { SpendingBalance } from "@/components/cards/spendingBalance";
import { LineChart } from "react-native-gifted-charts";
import Select from "@/components/atoms/select/select";
import { GreetingText } from "@/components/atoms/gretting";
import { ConvertCurrency } from "@/utils/currency/currencyConvertor";

export default function Dashboard() {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    greetingText: {
      fontWeight: "bold",
      fontSize: 16,
    },
    container: {
      gap: theme?.gaps.form,
    },
    trackingsContainer: {
      backgroundColor: theme?.colors.neutral2,
      padding: theme?.paddings.card,
      borderRadius: theme?.border.radius,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      gap: theme?.gaps.form,
    },
    graphContainer: {
      backgroundColor: theme?.colors.neutral2,
      padding: theme?.paddings.card,
      borderRadius: theme?.border.radius,
      gap: theme?.gaps.form,
    },
    graphDaysFilter: {
      width: 100,
      alignSelf: "flex-end",
    },
    graphBox: {},
  });
  const lineData = [
    { value: 100 },
    { value: 200 },
    { value: 18 },
    { value: 40 },
    { value: 36 },
    { value: 60 },
    { value: 54 },
    { value: 85 },
    { value: 54 },
    { value: 85 },
  ];

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Text style={styles.greetingText}>{`${GreetingText()}`}</Text>
        <SpendingBalance />
        <View style={styles.graphContainer}>
          <View style={styles.graphDaysFilter}>
            <Select
              style={{
                borderColor: theme?.colors.strokeNeutral,
                backgroundColor: theme?.colors.neutral,
                alignItems: "flex-start",
                minHeight: 25,
              }}
              containerStyle={{}}
              textStyle={{
                color: theme?.colors.text,
              }}
              arrowIconStyle={{ tintColor: theme?.colors.text }}
              open={false}
              setOpen={() => {}}
              setValue={() => {}}
              value={1}
              items={[{ label: "10 days", value: 1 }]}
            />
          </View>
          <View style={styles.graphBox}>
            <LineChart
              initialSpacing={0}
              data={lineData}
              dataPointsColor={theme?.colors.primary}
              thickness={1}
              // hideRules
              width={280}
              showVerticalLines
              curved
              hideYAxisText
              showDataPointLabelOnFocus
              showValuesAsDataPointsText
              yAxisTextStyle={{ color: theme?.colors.neutral }}
              yAxisColor={theme?.colors.primary}
              verticalLinesColor={theme?.colors.neutral}
              rulesColor={theme?.colors.neutral}
              rulesType="solid"
              xAxisColor={theme?.colors.primary}
              color={theme?.colors.primary}
            />
          </View>
        </View>
        <View>
          <Tab disableIndicator>
            <Tab.Item>Metals</Tab.Item>
            <Tab.Item>Coins</Tab.Item>
          </Tab>
          <View style={styles.trackingsContainer}>
            <TrackingCard
              unitMeasure="g"
              metal="XAU"
              imgUrl="https://img.icons8.com/?size=1080&id=60373&format=png"
              barColor="#ffd54f"
              onPress={() => {
                router.push({
                  pathname: "/userpanel/dashboard/trackingDetails",
                  params: {
                    imgUrl:
                      "https://img.icons8.com/?size=1080&id=60373&format=png",
                    metal: "XAU",
                    unitMeasure: "g",
                    metalId: 1,
                    barColor: "#ffd54f",
                  },
                });
              }}
            />
            <TrackingCard
              unitMeasure="g"
              metal="XAG"
              imgUrl="https://img.icons8.com/?size=1080&id=60376&format=png"
              barColor="#b0bec5"
            />
            <TrackingCard
              unitMeasure="g"
              metal="HG"
              imgUrl="https://img.icons8.com/?size=1080&id=60370&format=png"
              barColor="#ff8d69"
            />
            <TrackingCard
              unitMeasure="g"
              metal="XPD"
              imgUrl="https://img.icons8.com/?size=1080&id=60378&format=png"
              barColor="#bdbdbd"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
