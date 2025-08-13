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
    weightMeasure:""
  });

  const [openState, setOpenState] = useState({ currency: false ,weigthMeasure:false});
  const [currencyList, setCurrencyList] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [weightMeasureList,setWeightMeasureList] = useState([{label:"Grams",value:"gram"},{label:"Ounces",value:"ounce"}])
  type CurrencyData = {
    Currency: string;
    UnicodeFlag: string;
    Iso2: string;
    Iso3: string;
    Name: string;
  };

  useEffect(() => {
    (async () => {
      const savedCurrency = await AsyncStorage.getItem("currency") || "";
      const savedWeightMeasure = await AsyncStorage.getItem("weightMeasure") || "";
      if (savedCurrency) {
        setSettingsData((prev) => ({
          ...prev,
          currency: savedCurrency,
          weightMeasure:savedWeightMeasure
        }));
      }
    })();

    fetchCurrencyList()

  }, []);



  const fetchCurrencyList = ()=>{
    axios
      .get(`${BASE_URL}/api/v1/currency`)
      .then((res) => {
        if (res.data?.data) {
          const formattedList = res.data.data.map((value: CurrencyData) =>{
            return({
            label: `${value.UnicodeFlag} ${value.Currency} - ${value.Name}`,
            value: `${value.Currency}-${value.Name}`,
          })});
            
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
        <Label>Weight Measure</Label>
        <Select
          dropDownDirection="TOP"
          open={openState.weigthMeasure}
          items={weightMeasureList}
          setOpen={() => {
            setOpenState((prev) => ({
              ...prev,
              weigthMeasure: !prev.weigthMeasure,
            }));
          }}
          value={settingsData.weightMeasure}
          setValue={async (val) => {
            setSettingsData((prev) => ({ ...prev, weightMeasure: val(prev) }));
            await AsyncStorage.setItem("weightMeasure", val(null));
            console.log(await AsyncStorage.getItem("weightMeasure"));
          }}
        />
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
              await AsyncStorage.setItem("currency", val(null));
              console.log(await AsyncStorage.getItem("currency"));
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
