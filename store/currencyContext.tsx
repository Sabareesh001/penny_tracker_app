import AsyncStorage, { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const PreferenceContext = createContext<{
  currency: string;
  setCurrency?: React.Dispatch<React.SetStateAction<string>>;
  weightMeasure: string;
  setWeightMeasure?: React.Dispatch<React.SetStateAction<string>>;
  country: string;
  setCountry?: React.Dispatch<React.SetStateAction<string>>;
}>({
    currency: "",
    weightMeasure: "gram",
    country:"USA"
});

const PreferenceContextProvider = (props: { children: React.ReactNode }) => {
    const [currency, setCurrency] = useState("");
  const [weightMeasure, setWeightMeasure] = useState("");
    const [country, setCountry] = useState("");

 useEffect(() => {
   (async () => {
     const currency = await AsyncStorage.getItem("currency");
     const weightMeasure = await AsyncStorage.getItem("weightMeasure");
     if (!currency) {
       await AsyncStorage.setItem("currency", "USD-USA");
     } else {
       const splitList = currency.split("-");
       console.log(splitList[0]);
       setCurrency && setCurrency(splitList[0]);
       setCountry && setCountry(splitList[1]);
     }
     if (!weightMeasure) {
       await AsyncStorage.setItem("weightMeasure", "gram");
     } else {
       setWeightMeasure && setWeightMeasure(weightMeasure);
     }
   })();
 }, []);

  return (
    <PreferenceContext.Provider
      {...props}
      value={{ currency, setCurrency,country,setCountry,weightMeasure,setWeightMeasure}}
    ></PreferenceContext.Provider>
  );
};

const usePreferenceContext = () => {
  return useContext(PreferenceContext);
};

export { PreferenceContextProvider, usePreferenceContext };
