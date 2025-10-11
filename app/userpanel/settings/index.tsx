import { Button } from "@/components/atoms/button/button";
import { Label } from "@/components/atoms/label/label";
import Select from "@/components/atoms/select/select";
import { usePreferenceContext } from "@/store/currencyContext";
import { useLoginCtx } from "@/store/loginContext";
import { useTheme } from "@/theme/themeProvider";
import { BASE_URL } from "@/utils/apiHost";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage, { useAsyncStorage } from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect } from "expo-router";
import { navigate } from "expo-router/build/global-state/routing";
import * as SecureStore from "expo-secure-store"
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function Settings() {
  const { theme } = useTheme();
  const { loggedIn, setLoggedIn } = useLoginCtx();
  const [logoutLoading,setLogoutLoading] = useState(false);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "transparent",
      padding: theme?.paddings.page,
    },
    form:{
      flex:1,
      gap:theme?.gaps.form
    },
    button:{
       height:50
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

const {currency,setCurrency,weightMeasure,setWeightMeasure,setCountry} = usePreferenceContext()
  
    const fetchCurrencyList = async()=>{

      const currencyListStored = useAsyncStorage("currencyList")

      const currencyList = await currencyListStored.getItem()
      

      if(currencyList!=null){
         const stringToJSON =   JSON.parse(currencyList)
         setCurrencyList(stringToJSON)
         return
      }

      console.log("REACHED")

      axios
        .get(`${BASE_URL}/api/v1/currency`)
        .then(async(res) => {
          if (res.data?.data) {
            const formattedList = res.data.data.map((value: CurrencyData) =>{
              return({
              label: `${value.UnicodeFlag} ${value.Currency} - ${value.Name}`,
              value: `${value.Currency}-${value.Iso2}`,
            })});
            
            await currencyListStored.setItem(JSON.stringify(formattedList))

            setCurrencyList(formattedList);
          }
        })
        .catch((err) => {
          console.log(err.response);
        });
    }

  useFocusEffect(
    useCallback(() => {
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

  }, [])
  )


  const Logout = async()=>{

     setLogoutLoading(true);

     await SecureStore.deleteItemAsync("authToken");
     setLoggedIn!=null && setLoggedIn(false)
     setLogoutLoading(false)
     navigate("/login")
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
            setWeightMeasure && setWeightMeasure(val(null));
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
              const currencyPref = val(null); 
              const currency = currencyPref.split("-")[0];
              const country = currencyPref.split("-")[1];
              setCurrency && setCurrency(currency);
              setCountry && setCountry(country);
            }}
            items={currencyList}
            setOpen={() =>
              setOpenState((prev) => ({ ...prev, currency: !prev.currency }))
            }
            open={openState.currency}
          />
          <View style={styles.button}>
          <Button loading={logoutLoading} title="Logout" onPress={Logout} icon={<MaterialIcons color={theme?.colors.secondary} size={24} name="logout"/>}/>
          </View>
            </View>
    </View>
  );
}
