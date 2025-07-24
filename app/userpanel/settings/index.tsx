import { Label } from "@/components/atoms/label/label";
import Select from "@/components/atoms/select/select";
import { useTheme } from "@/theme/themeProvider";
import { BASE_URL } from "@/utils/apiHost";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function Settings() {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "transparent",
      padding: theme?.paddings.page,
    },
    form:{
      flex:1,
      gap:theme?.gaps.form
    }
  });

  const [settingsData, setSettingsData] = useState({
    currency: "",
  });

  const [openState, setOpenState] = useState({ currency: false });
  const [currencyList, setCurrencyList] = useState<
    Array<{ label: string; value: string }>
  >([]);

  type CurrencyData = {
    currency: string;
    flag: string;
    iso2: string;
    iso3: string;
    name: string;
  };

  useEffect(() => {
    (async () => {
      const savedCurrency = await AsyncStorage.getItem("currency");
      if (savedCurrency) {
        setSettingsData((prev) => ({
          ...prev,
          currency: savedCurrency,
        }));
      }
    })();

    fetchCurrencyList()

  }, []);

  useEffect(() => {

    
  }, []);

  const fetchCurrencyList = ()=>{
    axios
      .get(`${BASE_URL}/api/v1/currency`)
      .then((res) => {
        if (res.data?.data) {
          const formattedList = res.data.data.map((value: CurrencyData) => ({
            label: `${value.flag} ${value.currency} - ${value.name}`,
            value: `${value.currency}-${value.name}`,
          }));
          setCurrencyList(formattedList);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }


  return (
    <View style={styles.container}>
      <View style={styles.form}>
      <Label>Currency</Label>
      <Select
        searchable
        flatListProps={{
          initialNumToRender: 5,
          maxToRenderPerBatch: 5,
          windowSize: 250,
        }}
        searchPlaceholder="Search by country or currency code"
        listMode="FLATLIST"
        value={settingsData.currency}
        setValue={async (val) => {
          setSettingsData((prev) => ({ ...prev, currency: val(prev) }));
          await AsyncStorage.setItem("currency",val(null))
          console.log(await AsyncStorage.getItem("currency"))
        }}
        items={currencyList}
        setOpen={() =>
          setOpenState((prev) => ({ ...prev, currency: !prev.currency }))
        }
        open={openState.currency}
      />
      </View>
    </View>
  );
}
