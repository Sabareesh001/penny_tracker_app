import { Button } from "@/components/atoms/button/button";
import { SectionHeading } from "@/components/atoms/heading/heading";
import { Label } from "@/components/atoms/label/label";
import { TextField } from "@/components/atoms/textField/textField";
import { useTheme } from "@/theme/themeProvider";
import { BASE_URL } from "@/utils/apiHost";
import { GetCurrencySymbol } from "@/utils/currency";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import axios, { Axios, AxiosResponse } from "axios";
import getSymbolFromCurrency from "currency-symbol-map";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";

export default function Ledger(){

    const {theme} = useTheme()

    const currency = useAsyncStorage("currency")

    const [monthyIncome,setMonthlyIncome] = useState(0.0)
    const [originalMonthlyIncome,setOriginalMonthlyIncome] = useState(0.0)
    const [monthySavingsTarget,setMonthySavingsTarget] = useState(0.0)
    const [originalMonthlySavingsTarget,setOriginalMonthlySavingsTarget] = useState(0.0)
    const [currencySymbol,setCurrencySymbol] = useState("")
    const [incomeSaveLoading, setIncomeSaveLoading] = useState(false)
    const [savingTargetSaveLoading, setSavingTargetSaveLoading] = useState(false);
    

    const styles = StyleSheet.create({
        pageContainer : {
            padding: theme?.paddings.page,
            gap:theme?.gaps.form,
        },
        incomeContainer : {
            flexDirection:'row',
            gap:10,
            
        }
    })

    type IncomeResponse = {
        message:string,
        data:number
    }

    const fetchMonthlyIncome = ()=>{

        axios.get(`${BASE_URL}/api/v1/income`).then((res:AxiosResponse<IncomeResponse>)=>{
            setMonthlyIncome(res.data.data)
            setOriginalMonthlyIncome(res.data.data)
        }).catch((err)=>{ 
            console.log(err.response)
        })

    }

    const saveNewIncome = ()=>{
        setIncomeSaveLoading(true)
        axios.patch(`${BASE_URL}/api/v1/income/`, { income: monthyIncome }).then((res) => {
            setOriginalMonthlyIncome(monthyIncome)
            Toast.show({
                type:'success',
                text1:res.data.message
            })
        }).catch((err)=>{
             Toast.show({
                type:'error',
                text1:err.response.data.error
            })
        }).finally(()=>{
            setIncomeSaveLoading(false)
        })
    }
    
    useEffect(()=>{
        fetchMonthlyIncome()
    },[])
 
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
            <View style={styles.incomeContainer}>
                <View style={{flex:9}}>
            <TextField keyboardType="number-pad" inputMode="numeric" onChangeText={(e)=>{setMonthlyIncome(()=>{
                const converted = Number(e.slice(1))
                return isNaN(converted)?0:converted
            })}} editable value={`${currencySymbol} ${monthyIncome}`}>
            </TextField>
                </View>
            <Button onPress={saveNewIncome} loading={incomeSaveLoading} containerStyle={{flex:2}} disabled={originalMonthlyIncome==monthyIncome}  icon={<AntDesign  name="save"  size={20} color={theme?.colors.secondary}/>}/>
            </View>
             <Label>
                Monthly Savings Target
            </Label>
            <View style={styles.incomeContainer}>
                <View style={{flex:9}}>
            <TextField keyboardType="number-pad" inputMode="numeric" onChangeText={(e)=>{setMonthySavingsTarget(()=>{
                const converted = Number(e.slice(1))
                return isNaN(converted)?0:converted
            })}} editable value={`${currencySymbol} ${monthySavingsTarget}`}>
            </TextField>
                </View>
            <Button onPress={saveNewIncome} loading={savingTargetSaveLoading} containerStyle={{flex:2}} disabled={originalMonthlySavingsTarget==monthySavingsTarget}  icon={<AntDesign  name="save"  size={20} color={theme?.colors.secondary}/>}/>
            </View>
        </View>
     )
}