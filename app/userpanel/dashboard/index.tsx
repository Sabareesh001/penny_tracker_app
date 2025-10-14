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
import axios, { Axios, AxiosResponse } from "axios";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Animated, ScrollView, StyleSheet, View } from "react-native";
import { SpendingBalance } from "@/components/cards/spendingBalance";
import { LineChart } from "react-native-gifted-charts";
import Select from "@/components/atoms/select/select";
import { GreetingText } from "@/components/atoms/gretting";
import { ConvertCurrency } from "@/utils/currency/currencyConvertor";
import { usePreferenceContext } from "@/store/currencyContext";

export default function Dashboard() {
  const { theme } = useTheme();

  type TrackingResponseType = {
    Id: number;
    Image: string;
    Name: string;
    Status: string;
    Symbol: string;
    Color: string;
  };
  const [trackingSection, setTrackingSection] = useState(0);

  const [trackingData, setTrackingData] = useState<TrackingResponseType[]>([]);

  const { weightMeasure } = usePreferenceContext();
  const [paymentsData, setPaymentsData] = useState<any[]>([]);
  const [lineData, setLineData] = useState([]);
  const [xLabels, setXLabels] = useState([]);

  const prepareGraphData = (payments: any[]) => {
    const totalsByDate: Record<string, number> = {};

    payments.forEach((p) => {
      const date = new Date(p.Datetime).toLocaleDateString(); // e.g., 14/10/2025
      if (!totalsByDate[date]) totalsByDate[date] = 0;
      totalsByDate[date] += p.Amount;
    });

    // Sort dates
    let sortedDates = Object.keys(totalsByDate).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    const totals = sortedDates.map((date) => ({ value: totalsByDate[date] }));

    sortedDates = sortedDates.map((item) => item.slice(0, 5));
    setXLabels(sortedDates);
    setLineData(totals);
    console.log(totals);
  };

  const fetchPaymentsGraph = async () => {
    try {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      const res = await axios.get(`${BASE_URL}/api/v1/payment/all`, {
        params: { month, year },
      });
      setPaymentsData(res.data.data);
      prepareGraphData(res.data.data);
    } catch (err) {
      console.error("Error fetching payments for graph:", err);
    }
  };

  useEffect(() => {
    fetchPaymentsGraph();
  }, []);

  useEffect(() => {
    (async () => {
      axios
        .get(`${BASE_URL}/api/v1/${trackingSection == 0 ? "metal" : "coin"}`)
        .then((res: AxiosResponse<{ data: TrackingResponseType[] }>) => {
          setTrackingData(res.data.data);
        });
    })();
  }, [trackingSection]);

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
      justifyContent: 'space-around',
      flexDirection: 'row',
      alignItems:'center',
      flex:1
    },
    graphBox: {},
  });

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Text style={styles.greetingText}>{`${GreetingText()}`}</Text>
        <SpendingBalance />
        <View style={styles.graphContainer}>
          <View style={styles.graphDaysFilter}>
            <Text style={{ flex: 2 }}>{`Spending Summary`}</Text>
            <Select
              style={{
                borderColor: theme?.colors.strokeNeutral,
                backgroundColor: theme?.colors.neutral,
                alignItems: "flex-start",
                minHeight: 25,
              }}
              containerStyle={{ flex: 1 }}
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
              initialSpacing={20}
              data={lineData}
              xAxisLabelTexts={xLabels} // <-- dates here
              dataPointsColor={theme?.colors.primary}
              thickness={1}
              width={280}
              showVerticalLines
              curved
              spacing={80}
              hideYAxisText
              showDataPointLabelOnFocus
              xAxisLabelTextStyle={{ color: theme?.colors.text }}
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
          <Tab
            onChange={setTrackingSection}
            value={trackingSection}
            disableIndicator
          >
            <Tab.Item id="metal">Metals</Tab.Item>
            <Tab.Item id="coin">Coins</Tab.Item>
          </Tab>
          <View style={styles.trackingsContainer}>
            {trackingData.map((item) => (
              <TrackingCard
                key={item.Id}
                unitMeasure={
                  trackingSection == 0 ? weightMeasure.slice(0, 1) : "coin"
                }
                metal={item.Symbol}
                imgUrl={item.Image}
                barColor={item.Color}
                onPress={() => {
                  router.push({
                    pathname: "/userpanel/dashboard/trackingDetails",
                    params: {
                      imgUrl: item.Image,
                      metal: item.Symbol,
                      unitMeasure:
                        trackingSection == 0 ? weightMeasure : "coin",
                      metalId: item.Id,
                      barColor: item.Color,
                    },
                  });
                }}
              />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
