import { Card } from "@/components/atoms/card/card";
import { SectionHeading } from "@/components/atoms/heading/heading";
import { Loader } from "@/components/atoms/loader/loader";
import { CheckedContainer } from "@/components/checkedContainer";
import { useTheme } from "@/theme/themeProvider";
import { BASE_URL } from "@/utils/apiHost";
import axios from "axios";
import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { Image, View } from "react-native"

export interface TrackingItem {
    Id: number;
    Name: string;
    Image: string;
    Symbol: string;
    Status:string;
}

export interface TrackingResponse {
    data: TrackingItem[];
    message: string;
}

const AddTracking = ()=>{

       const [metals,setMetals] = useState<TrackingItem[]>([]);
       const [coins,setCoins] = useState<TrackingItem[]>([]);
    
       const {theme} = useTheme();

       const fetchMetals = ()=>{
        axios.get(`${BASE_URL}/api/v1/metal`).then((res:{data:TrackingResponse})=>{
             setMetals(res.data.data);
          })
       }
       const fetchCoins = ()=>{
        axios.get(`${BASE_URL}/api/v1/coin`).then((res:{data:TrackingResponse})=>{
             setCoins(res.data.data);
          })
       }

       useEffect(()=>{
          fetchCoins()
          fetchMetals()
       },[])

       const styles = StyleSheet.create({
        container:{
            flex:1,
            padding:theme?.paddings.page,
            gap:theme?.gaps.form,
            backgroundColor:theme?.colors.secondary,
            alignItems:'center',
            justifyContent:'center'
        },
                sectionContainer:  {
                flex:1,
                justifyContent:'flex-start',
                alignContent:'center',
               flexDirection:'row',
               flexWrap:'wrap',
               gap:theme?.gaps.form
            },
            resourcesCard:{
                height:70,
                width:70
            }
       })

       return(
        <View style={styles.container} >
            {
                metals.length == 0 && coins.length == 0 && <Loader color={theme?.colors.primary}></Loader>
            }
           { metals.length>0 && <SectionHeading>Metals</SectionHeading>}
            <View style={styles.sectionContainer}>
            {
                metals.map((item)=>(
            <CheckedContainer  checked={item.Status=="1"}>
                    <View style={styles.resourcesCard} key={item.Symbol}>
                        <Image
                        height={40}
                        width={40}
                        source={{uri:item.Image}}
                        />
                        <Text>{item.Name}</Text>
                        </View>
                        </CheckedContainer>
                ))
            }
            </View>
              { coins.length>0 && <SectionHeading>Coins</SectionHeading>}
                             <View style={styles.sectionContainer}>

            {
                coins.map((item)=>(
            <CheckedContainer checked={item.Symbol=="1"}>
                    <View style={styles.resourcesCard} key={item.Symbol}>
                        <Image
                        height={40}
                        width={40}
                        source={{uri:item.Image}}
                        />
                        <Text>{item.Name}</Text>
                        </View>
            </CheckedContainer>
                ))
            }
                        </View>
           
        </View>
       )

}

export default AddTracking;