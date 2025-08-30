import { Button } from "@/components/atoms/button/button";
import { SectionHeading } from "@/components/atoms/heading/heading";
import { TextField } from "@/components/atoms/textField/textField";
import { TrackingCard } from "@/components/trackingCard";
import { useTheme } from "@/theme/themeProvider";
import { BASE_URL } from "@/utils/apiHost";
import AntDesign from "@expo/vector-icons/AntDesign"
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function TrackingDetails() {
    const params = useLocalSearchParams()
    const [holding, setHolding] = useState(0.0)
    const incrementRef = useRef<number | null>(null);
    const decrementRef = useRef<number | null>(null);
    const [editingWeight,setEditingWeight] = useState(false);
    const [modifiedHolding, setModifiedHolding] = useState(0.0);
    const [resourceDisplayText,setReasourceDisplayText] = useState("");
    const { imgUrl, metal, unitMeasure, isModal } = params;
    const[saveLoading,setSaveLoading] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        setModifiedHolding(holding)
    }, [holding])




    const styles = StyleSheet.create({
        containerStyle: {
            height: "100%",
            padding: theme?.paddings.page,
            backgroundColor: theme?.colors.secondary,
            gap: theme?.gaps.form
        },
        optionsContainer: {
            flexDirection: 'row',
            justifyContent: "space-between",
            alignItems: 'center',
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
            height:50,
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

    const handleWeightSubmit = ()=>{
        setSaveLoading(true)
        axios.post(`${BASE_URL}/api/v1/metal/weight`,{metal_id:3,weight:modifiedHolding}).then(()=>{

        }).finally(()=>{
            setSaveLoading(false)
        })
    }

    return (
        <View style={styles.containerStyle}>
            <TrackingCard
                height={250}
                imgUrl={Array.isArray(imgUrl) ? "" : imgUrl}
                metal={Array.isArray(metal) ? "" : metal}
                unitMeasure={Array.isArray(unitMeasure) ? "" : unitMeasure}
                isModal={true}
                setHolding={setHolding}
            />
            <View style={styles.optionsContainer}>
                <Pressable onPressOut={() => { handlePressOut(decrementRef) }} onLongPress={handleDecrementLongPress} onPress={handleDecrementPress}>
                    <View style={styles.optionContainer}>
                        <AntDesign size={24} color={theme?.colors.danger.danger} name="minus" />
                    </View>
                </Pressable>
                <TextField  inputMode="numeric" onPress={()=>{setEditingWeight(true)}} onChangeText={(e)=>{if(!Number.isNaN(Number(e))) setModifiedHolding(Number(e));}} onSubmitEditing={()=>setEditingWeight(false)} keyboardType="number-pad" style={styles.resourceManagement} >
                {`${editingWeight?modifiedHolding:modifiedHolding.toFixed(2)}`+`${editingWeight?"":" "+unitMeasure+"s"}`}
                </TextField>
                <Pressable onPressOut={() => { handlePressOut(incrementRef) }} onLongPress={handleIncrementLongPress} onPress={handleIncrementPress}>
                    <View style={styles.optionContainer}>
                        <AntDesign size={24} color={theme?.colors.success.success} name="plus" />
                    </View>
                </Pressable>
            </View>
            {
             modifiedHolding.toFixed(2) !== holding.toFixed(2) && 
            (<View style={styles.buttonContainer}>
                <Button loading={saveLoading} onPress={handleWeightSubmit} icon={<Ionicons color={theme?.colors.secondary} size={24} name="save" />} title="Save"/>
            </View>)
            }
        </View>
    )
}