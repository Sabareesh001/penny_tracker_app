import { Button } from "@/components/atoms/button/button";
import { SectionHeading } from "@/components/atoms/heading/heading";
import { FullPageLoader } from "@/components/atoms/loader";
import { TextField } from "@/components/atoms/textField/textField";
import { TrackingCard } from "@/components/cards/tracking";
import { useTheme } from "@/theme/themeProvider";
import { BASE_URL } from "@/utils/apiHost";
import { gramToOunce } from "@/utils/weightConvertor";
import AntDesign from "@expo/vector-icons/AntDesign"
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage, { useAsyncStorage } from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";

export default function TrackingDetails() {
    const params = useLocalSearchParams()
    const [holding, setHolding] = useState(-1)
    const incrementRef = useRef<number | null>(null);
    const decrementRef = useRef<number | null>(null);
    const [editingWeight,setEditingWeight] = useState(false);
    const [modifiedHolding, setModifiedHolding] = useState(-1);
    const { imgUrl, metal, unitMeasure,metalId,isModal,barColor } = params;
    const[saveLoading,setSaveLoading] = useState(false);
    const [refreshKey,setRefreshKey] = useState(-1);
    const { theme } = useTheme();
    useEffect(() => {
        setModifiedHolding(holding)
    }, [holding])




    const styles = StyleSheet.create({
        containerStyle: {
            height: "100%",
            backgroundColor: theme?.colors.secondary,
            gap: theme?.gaps.form,
            alignItems:'center'
        },
        optionsContainer: {
            flexDirection: 'row',
            justifyContent:'space-between',
            alignItems: 'center',
            width:'100%',
            gap: theme?.gaps.form
        },
        optionContainer: {
            alignItems: 'center',
            justifyContent: "center",
            gap: theme?.gaps.info,
            backgroundColor: theme?.colors.primary,
            padding: theme?.border.padding,
            borderRadius: theme?.border.radius,
            borderColor: theme?.border.color,
            borderWidth: theme?.border.borderWidth
        },
        resourceManagement: {
            backgroundColor: theme?.colors.primary,
            flex: 1,
            color: theme?.colors.secondary,
            padding: theme?.border.padding,
            borderRadius: theme?.border.radius
        },
        buttonContainer:{
            height: 50,
            width:'100%'
        }
    })

    const handleIncrementPress = () => {
        setModifiedHolding((prev) => Math.min(prev + 1, Number.MAX_SAFE_INTEGER))
    }

    const handleIncrementLongPress = () => {
        handleIncrementPress()
        incrementRef.current = setInterval(handleIncrementPress, 100)
    }
    const handleDecrementPress = () => {
        setModifiedHolding((prev) => Math.max(prev - 1, 0))
    }

    const handleDecrementLongPress = () => {
        handleDecrementPress()
        decrementRef.current = setInterval(handleDecrementPress, 100)
    }
    const handlePressOut = (ref: React.RefObject<number | null>) => {
        ref.current != null && clearInterval(ref.current)
    }

    const handleWeightSubmit = async()=>{
        setSaveLoading(true)
        const finalWeight = unitMeasure=="gram"?gramToOunce(modifiedHolding):modifiedHolding
        console.log(metalId)
        axios.post(`${BASE_URL}/api/v1/${unitMeasure=="coin"?"coin":"metal"}/${unitMeasure=="coin"?"quantity":"weight"}`,{metal_id:Number(metalId),weight:finalWeight}).then((res)=>{
          
            Toast.show({
                type:"success",
                text1:res.data.message
            })


        }).finally(()=>{
            setSaveLoading(false)
            setRefreshKey((prev)=>prev*-1)
        })
    }

    return (
        <View style={styles.containerStyle}>
           
            {refreshKey>-2 && <TrackingCard
                height={250}
                key={refreshKey}
                imgUrl={Array.isArray(imgUrl) ? "" : imgUrl}
                metal={Array.isArray(metal) ? "" : metal}
                unitMeasure={Array.isArray(unitMeasure) ? "" : unitMeasure}
                isModal={true}
                barColor={Array.isArray(barColor)?"":barColor}
                setHolding={setHolding}
            />}
            <View style={styles.optionsContainer}>
                <Pressable  onPressOut={() => { handlePressOut(decrementRef) }} onLongPress={handleDecrementLongPress} onPress={handleDecrementPress}>
                    <View style={styles.optionContainer}>
                        <AntDesign size={24} color={theme?.colors.danger.danger} name="minus" />
                    </View>
                </Pressable>
                <TextField flex={1}   width={200} inputMode="numeric" onPress={()=>{setEditingWeight(true)}} onChangeText={(e)=>{if(!Number.isNaN(Number(e))) setModifiedHolding(Number(e));}} onSubmitEditing={()=>setEditingWeight(false)} keyboardType="number-pad" style={styles.resourceManagement} >
                {`${editingWeight?modifiedHolding:modifiedHolding.toFixed(2)}`+`${editingWeight?"":" "+unitMeasure+"s"}`}
                </TextField>
                <Pressable  onPressOut={() => { handlePressOut(incrementRef) }} onLongPress={handleIncrementLongPress} onPress={handleIncrementPress}>
                    <View style={styles.optionContainer}>
                        <AntDesign size={24} color={theme?.colors.success.success} name="plus" />
                    </View>
                </Pressable>
            </View>
            { 
            (<View style={styles.buttonContainer}>
                <Button  loading={saveLoading} disabled={ modifiedHolding==-1 || modifiedHolding.toFixed(2) === holding.toFixed(2)} onPress={handleWeightSubmit} icon={<Ionicons color={theme?.colors.secondary} size={24} name="save-outline" />} title="Save"/>
            </View>)
            }
        </View>
    )
}