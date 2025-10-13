import { usePreferenceContext } from "@/store/currencyContext"
import { useAsyncStorage } from "@react-native-async-storage/async-storage"
import getSymbolFromCurrency from "currency-symbol-map"

const GetCurrencySymbol =():string=>{
    const { currency } = usePreferenceContext();
    const symbol = getSymbolFromCurrency(currency) || "";
    return  symbol
}

export {GetCurrencySymbol}