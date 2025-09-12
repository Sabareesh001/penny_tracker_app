import { useAsyncStorage } from "@react-native-async-storage/async-storage"
import getSymbolFromCurrency from "currency-symbol-map"

const GetCurrencySymbol = async():Promise<string>=>{
    const currency = useAsyncStorage("currency")
   const currencyPref = await  currency.getItem() || ""
    const symbol = getSymbolFromCurrency(currencyPref.split("-")[0]) || ""
    return  Promise.resolve(symbol)
}

export {GetCurrencySymbol}