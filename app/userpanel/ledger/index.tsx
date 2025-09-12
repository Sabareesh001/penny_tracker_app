import { SectionHeading } from "@/components/atoms/heading/heading";
import { Label } from "@/components/atoms/label/label";
import { TextField } from "@/components/atoms/textField/textField";
import { useTheme } from "@/theme/themeProvider";
import { GetCurrencySymbol } from "@/utils/currency";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import getSymbolFromCurrency from "currency-symbol-map";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function Ledger(){

    const {theme} = useTheme()

    const currency = useAsyncStorage("currency")


    const [currencySymbol,setCurrencySymbol] = useState("")

    const styles = StyleSheet.create({
        pageContainer : {
            padding: theme?.paddings.page,
            gap:theme?.gaps.form
        }
    })

    useEffect(()=>{

        const setCurrSymbol = async()=>{
            const symbol = await GetCurrencySymbol()
            setCurrencySymbol(symbol)
        }

        setCurrSymbol()

    },[currency])


     return(
        <View style={styles.pageContainer}>
            <Label>
                Monthly Income
            </Label>
            <TextField value={`${currencySymbol} 1234`}>

            </TextField>
        </View>
     )
}