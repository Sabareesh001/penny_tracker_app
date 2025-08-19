import { TrackingCard } from "@/components/trackingCard";
import { useTheme } from "@/theme/themeProvider";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { router, Stack } from "expo-router";
import { navigate } from "expo-router/build/global-state/routing";
import { useEffect, useState } from "react";
import { Dimensions, FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";

export default function Dashboard() {
  const { theme } = useTheme();
  const weightMeasureStore = useAsyncStorage("weightMeasure");
  const [weightMeasure, setWeightMeasure] = useState("ounce");
  const screenWidth = Dimensions.get("window").width;
  const cardSpacing = theme?.gaps?.form || 16;
  const numColumns = 2;
  const cardWidth = (screenWidth - cardSpacing * (numColumns + 2)) / numColumns;

  const styles = StyleSheet.create({
    container: {
      padding: cardSpacing,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginTop: 16,
      marginBottom: 8,
      color: theme?.colors?.text,
    },
    cardWrapper: {
      width: cardWidth,
      margin: cardSpacing / 3,
    },
    cardsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
  });

  useEffect(() => {
    (async () => {
      const savedMeasure = await weightMeasureStore.getItem();
      setWeightMeasure(savedMeasure || "ounce");
    })();
  }, [weightMeasureStore]);

  const sections = [
    {
      title: "Metals",
      unitMeasure: weightMeasure,
      data: [
        {
          imgUrl: "https://img.icons8.com/?size=1024&id=60373&format=png",
          metal: "XAU",
        },
        {
          imgUrl: "https://img.icons8.com/?size=1024&id=60376&format=png",
          metal: "XAG",
        },
        {
          imgUrl: "https://img.icons8.com/?size=1024&id=60378&format=png",
          metal: "XPD",
        },
        {
          imgUrl:
            "https://img.icons8.com/?size=1024&id=sC04ZKtFcvpm&format=png",
          metal: "HG",
        },
      ],
    },
    {
      title: "Coins",
      unitMeasure: "coin",
      data: [
        {
          imgUrl: "https://img.icons8.com/?size=1024&id=63192&format=png",
          metal: "BTC",
        },
        {
          imgUrl:
            "https://img.icons8.com/?size=1024&id=NU48HGBGk0Do&format=png",
          metal: "ETH",
        },
      ],
    },
  ];

  return (
    <>
      <FlatList
        data={sections}
        keyExtractor={(section) => section.title}
        renderItem={({ item: section }) => (
          <View style={styles.container}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.cardsContainer}>
              {section.data.map((item) => {

                const CurrentCard = ({isModal}:{isModal?:boolean}) => (<TrackingCard
                  imgUrl={item.imgUrl}
                  metal={item.metal}
                  unitMeasure={section.unitMeasure}
                  isModal={isModal}
                />)

                return (
                  <Pressable key={item.metal} onPress={()=>{router.push({pathname:"/userpanel/dashboard/trackingDetails",params:{imgUrl:item.imgUrl,metal:item.metal,unitMeasure:section.unitMeasure}})}}>
                    <View key={item.metal} style={styles.cardWrapper}>
                      {
                        <CurrentCard  />
                      }
                    </View>
                  </Pressable>
                )
              })}
            </View>
          </View>
        )}

      />
    </>
  );
}
