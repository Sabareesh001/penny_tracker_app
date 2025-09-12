import { Card } from "@/components/atoms/card/card";
import { SectionHeading } from "@/components/atoms/heading/heading";
import { Loader } from "@/components/atoms/loader";
import { ToastStyled } from "@/components/atoms/toast/toast";
import { CheckedContainer } from "@/components/checkedContainer";
import { getFullPageLoader } from "@/store/pageContext";
import { useTheme } from "@/theme/themeProvider";
import { BASE_URL } from "@/utils/apiHost";
import axios from "axios";
import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { Image, View } from "react-native"
import Toast from "react-native-toast-message";

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

       const {fullPageLoaderOpen,setFullPageLoaderOpen} = getFullPageLoader()

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
          if(metals.length == 0 && coins.length == 0){
           setFullPageLoaderOpen && setFullPageLoaderOpen(true)
          }
          else if(fullPageLoaderOpen){
           setFullPageLoaderOpen &&  setFullPageLoaderOpen(false)
          }
       },[metals,coins])

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

       const changeTrackingStatus = ({type,status,id}:{type:"metal" | "coin",status:"add" | "remove",id:Number})=>{
            
            setFullPageLoaderOpen && setFullPageLoaderOpen(true)

            axios.post(`${BASE_URL}/api/v1/${type}/tracking/${id}/${status}`).then((res)=>{
                console.log(res.data)
                Toast.show({
                    type:"success",
                    text1:res.data?.message
                })
                fetchMetals();
                fetchCoins()
            }).catch((error)=>{
                Toast.show({
                    type:"error",
                    text1:error.response.data.error
                })
            }).finally(()=>{
                setFullPageLoaderOpen && setFullPageLoaderOpen(false)
            })
       } 

       return(
        <View style={styles.container} >
         
           { metals.length>0 && <SectionHeading>Metals</SectionHeading>}
            <View style={styles.sectionContainer}>
            {
                metals.map((item)=>(

            <CheckedContainer onPress={()=>{changeTrackingStatus({type:"metal",status:item.Status=="1"?"remove":"add",id:item.Id})}}  key={item.Symbol}  checked={item.Status=="1"}>
                    <View
                    style={styles.resourcesCard}>
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
            <CheckedContainer onPress={()=>{changeTrackingStatus({type:"coin",status:item.Status=="1"?"remove":"add",id:item.Id})}} key={item.Symbol} checked={item.Status=="1"}>
                    <View style={styles.resourcesCard} >
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